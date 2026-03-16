variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "northamerica-northeast1"
}

variable "cluster_name" {
  description = "GKE Cluster name"
  type        = string
  default     = "neighborhood-vibe-cluster"
}

variable "node_count" {
  description = "Number of nodes per zone"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "GCE machine type"
  type        = string
  default     = "e2-medium"
}