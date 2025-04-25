data "aws_caller_identity" "current" {}

provider "aws" {
  region = var.aws_region
}

resource "aws_cloudwatch_log_group" "slauth_logs" {
  name              = "/ecs/slauth-api"
  retention_in_days = 7
}

resource "aws_ecs_cluster" "slauth_cluster" {
  name = "slauth-cluster"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "slauth-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  enable_nat_gateway = false
  single_nat_gateway = false
  enable_dns_hostnames = true
}

resource "aws_ecs_task_definition" "slauth_task" {
  family                   = "slauth-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_exec.arn

  container_definitions = jsonencode([
    {
      name      = "slauth-api"
      image     = var.container_image
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.slauth_logs.name,
          awslogs-region        = var.aws_region,
          awslogs-stream-prefix = "ecs"
        }
      },
      environment = [
        {
          name  = "MONGO_URI"
          value = data.aws_ssm_parameter.mongo_uri.value
        },
        {
          name  = "Jwt__Secret"
          value = data.aws_ssm_parameter.jwt_secret.value
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "slauth_service" {
  name            = "slauth-api-service"
  cluster         = aws_ecs_cluster.slauth_cluster.id
  launch_type     = "FARGATE"
  task_definition = aws_ecs_task_definition.slauth_task.arn
  desired_count   = 1
  network_configuration {
    subnets         = module.vpc.public_subnets
    assign_public_ip = true
    security_groups = [aws_security_group.ecs_sg.id]
  }
  depends_on = [aws_ecs_cluster.slauth_cluster]
}

resource "aws_security_group" "ecs_sg" {
  name        = "slauth-sg"
  description = "Allow HTTP inbound"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ecs_task_exec" {
  name = "slauthTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_cloudwatch_access" {
  name = "SlauthCloudWatchAccess"
  role = aws_iam_role.ecs_task_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_ssm_access" {
  name = "SlauthSSMAccess"
  role = aws_iam_role.ecs_task_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ],
        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/slauth-kit/jwt-secret"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_exec_policy" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_ssm_parameter" "mongo_uri" {
  name = "/slauth-kit/mongo-uri"
  with_decryption = true
}

data "aws_ssm_parameter" "jwt_secret" {
  name = "/slauth-kit/jwt-secret"
  with_decryption = true
}