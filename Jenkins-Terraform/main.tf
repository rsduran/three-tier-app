provider "aws" {
  region = "ap-southeast-2"
}

# Create a new VPC
resource "aws_vpc" "jenkins_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "Jenkins-VPC"
  }
}

# Create a subnet in the new VPC
resource "aws_subnet" "jenkins_subnet" {
  vpc_id                  = aws_vpc.jenkins_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true  # Automatically assign a public IP

  tags = {
    Name = "Jenkins-Subnet"
  }
}

# Create an internet gateway for the VPC
resource "aws_internet_gateway" "jenkins_igw" {
  vpc_id = aws_vpc.jenkins_vpc.id

  tags = {
    Name = "Jenkins-Internet-Gateway"
  }
}

# Create a route table
resource "aws_route_table" "jenkins_route_table" {
  vpc_id = aws_vpc.jenkins_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.jenkins_igw.id
  }

  tags = {
    Name = "Jenkins-Route-Table"
  }
}

# Associate the route table with the subnet
resource "aws_route_table_association" "jenkins_route_table_association" {
  subnet_id      = aws_subnet.jenkins_subnet.id
  route_table_id = aws_route_table.jenkins_route_table.id
}

# Create a security group for the Jenkins server
resource "aws_security_group" "jenkins_sg" {
  vpc_id      = aws_vpc.jenkins_vpc.id
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

  tags = {
    Name = "Jenkins-SG"
  }
}

# Create an EC2 instance for Jenkins in the new subnet
resource "aws_instance" "jenkins_server" {
  ami                         = "ami-0892a9c01908fafd1"  # Use Ubuntu 22.04 AMI; update to your region-specific AMI ID
  instance_type               = "t2.medium"               # The smallest instance to keep costs low
  key_name                    = "rsduran"                # Replace with your existing key pair
  subnet_id                   = aws_subnet.jenkins_subnet.id
  vpc_security_group_ids      = [aws_security_group.jenkins_sg.id]

  user_data = file("jenkins-setup.sh")

  tags = {
    Name = "Jenkins-Server"
  }
}

output "jenkins_server_ip" {
  value = aws_instance.jenkins_server.public_ip
}
