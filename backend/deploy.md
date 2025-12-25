```
[ OUTER WORLD ] 
      |
      | (1) User sends request to: http://api.thissdemayur.me
      v
+-------------------------------------------------------------+
|  AWS NETWORK (VPC)                                          |
|                                                             |
|  +-------------------------+                                |
|  |  ecotrack-alb-sg        | <--- Gate 1: Public Entry      |
|  |  (Allows Port 80/443)   |                                |
|  +------------+------------+                                |
|               |                                             |
|               | (2) ALB picks a "Healthy" target from       |
|               |     the Target Group (tg-ecotrack-api)      |
|               v                                             |
|  +-------------------------+                                |
|  |  ecotrack-ecs-sg        | <--- Gate 2: Internal Security |
|  |  (Allows 32768-65535)   |      (Only allows the ALB)     |
|  +------------+------------+                                |
|               |                                             |
|               | (3) Traffic hits EC2 Instance on            |
|               |     Dynamic Port (e.g., 32804)              |
|               v                                             |
|        +--------------+                                     |
|        | Docker Proxy | <--- Gate 3: The Bridge             |
|        +------+-------+                                     |
|               |                                             |
|               | (4) Port 32804 is mapped to Port 3000       |
|               v                                             |
|      +------------------+                                   |
|      | Your Node.js App | <--- THE DESTINATION              |
|      | (Port 3000)      |                                   |
|      +------------------+                                   |
+-------------------------------------------------------------+
```