# EnergeX-AI Full-Stack Technical Assessment

## Quick Start (Juicy Stuff)

Get the entire app up and running in **one command**:

```bash
git clone https://github.com/energexai/EnergeX-AI-Hiring-Test.git
cd EnergeX-AI-Hiring-Test
docker compose up --build
```

This will:

1. Build and start all containers (Lumen, Node.js, MySQL, Redis, Frontend).
2. Wait for MySQL to be ready.
3. Run migrations and seed the database automatically.
4. Start the Lumen API, Node.js cache service, and frontend.

Access the services:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Lumen API:** [http://localhost:8080/api](http://localhost:8080/api)
* **Node Cache API:** [http://localhost:3000/cache](http://localhost:3000/cache)

---

* Postman
  collection - https://emergex-6561.postman.co/workspace/Emergex~eda12133-79d4-4537-888f-d12ea1b92051/collection/21675576-c41fb280-011a-485a-8591-444ef85a6798?action=share&source=copy-link&creator=21675576
* *Loom Demo* - https://www.loom.com/share/7068f959e4264e9d898a9b163e835931