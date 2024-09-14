provider "aws" {
  region = "ap-southeast-2"  # Update to your preferred region
}

resource "aws_instance" "jenkins_server" {
  ami           = "ami-0892a9c01908fafd1"  # Use Ubuntu 22.04 AMI; update to your region-specific AMI ID
  instance_type = "t2.micro"               # The smallest instance to keep costs low
  key_name      = "rsduran"          # Replace with your existing key pair
  security_groups = [aws_security_group.jenkins_sg.name]

  user_data = file("jenkins-setup.sh")

  tags = {
    Name = "Jenkins-Server"
  }
}

resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-sg"
  description = "Allow Jenkins and SSH"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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

output "jenkins_server_ip" {
  value = aws_instance.jenkins_server.public_ip
}
