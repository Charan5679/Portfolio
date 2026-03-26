// lib/data.ts — Sri Charan Vagalagani portfolio content

export const personal = {
  name: "Sri Charan Vagalagani",
  shortName: "Sri Charan",
  initials: "SC",
  role: "Full Stack Developer & Computer Science Graduate Student",
  tagline: "I build\nsystems that scale.",
  bio: "Computer Science graduate student at Cleveland State University with a strong background in full-stack development, data structures, and system design. Experienced in Java, React, Node.js, and Spring Boot — with a focus on performance, reliability, and real-world impact.",
  location: "Cleveland, OH",
  timezone: "America/New_York",
  timezoneLabel: "EST",
  email: "sricharan5679@gmail.com",
  phone: "(216) 338-9761",
  github: "https://github.com/charan5679",
  linkedin: "https://linkedin.com/in/sricharanv",
  twitter: "",
  website: "",
  availability: "Open to full-time roles - May 2026",
};

export const stats = [
  { value: 25, suffix: "%",  label: "Latency reduction at Tech Mahindra" },
  { value: 2,  suffix: "+",  label: "Years of development experience" },
  { value: 4,  suffix: "+",  label: "Production projects shipped" },
  { value: 20, suffix: "%",  label: "GAN model convergence improvement" },
];

export const skills = {
  "Languages":       ["Java", "Python", "JavaScript", "TypeScript", "SQL"],
  "Frameworks":      ["React.js", "Node.js", "Next.js", "Spring Boot", "Angular"],
  "AI / ML":         ["PyTorch", "GANs", "Isolation Forest", "Computer Vision", "Scikit-learn"],
  "Databases":       ["MySQL", "MongoDB", "PostgreSQL", "Firebase"],
  "Cloud & DevOps":  ["AWS", "Docker", "Jenkins", "CI/CD", "Git / GitHub"],
  "Data & Analytics":["Tableau", "MS Excel (Advanced)", "ELK Stack", "Kibana"],
  "Practices":       ["REST APIs", "OOP", "Data Structures", "Agile", "SCRUM", "Microservices", "Unit Testing"],
};

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  emoji: string;
  gradient: string;
  featured: boolean;
  year: string;
  overview: string;
  challenge: string;
  solution: string;
  architecture: string;
  outcomes: string[];
  lessons: string;
  stack: string[];
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "log-analytics",
    title: "Real-time Log Analytics & Anomaly Detection",
    subtitle: "ELK stack pipeline with ML-based anomaly detection for security monitoring",
    category: "AI / ML",
    tags: ["Python", "ELK Stack", "Kibana", "Isolation Forest", "Elasticsearch"],
    emoji: "◈",
    gradient: "from-zinc-800 to-zinc-900",
    featured: true,
    year: "2025",
    overview:
      "An end-to-end real-time log analytics system that ingests synthetic SSH logs, processes them through an ELK pipeline, and applies a Python Isolation Forest model to detect anomalous login patterns with high accuracy.",
    challenge:
      "Security teams struggle to detect irregular login activity in high-volume log streams. Manual review of SSH logs is slow and error-prone, and threshold-based alerting misses subtle, low-frequency anomalies that could indicate intrusions.",
    solution:
      "Built an ELK stack ingestion pipeline for SSH log data, then trained an Isolation Forest model on feature-engineered log records. Integrated Kibana dashboards with automated alerting to surface anomalous access patterns in near real-time.",
    architecture:
      "SSH logs → Logstash (parse + enrich) → Elasticsearch index → Python Isolation Forest model (batch scoring) → Kibana dashboard (anomaly visualization + alerts). Model retrained nightly on rolling 7-day log window.",
    outcomes: [
      "High anomaly detection accuracy on synthetic SSH log dataset",
      "Kibana dashboards with integrated alerting for rapid detection",
      "Automated security alerts triggered on login irregularities",
      "Scalable pipeline design supporting real production log volumes",
    ],
    lessons:
      "Feature engineering on log data matters far more than model choice. Extracting time-of-day, geo-delta, and failure-rate features from raw SSH logs drove most of the accuracy gains over the baseline.",
    stack: ["Python", "Elasticsearch", "Logstash", "Kibana", "Scikit-learn", "Isolation Forest", "Docker"],
    links: [{ label: "GitHub", href: personal.github }],
  },
  {
    slug: "gan-image-generator",
    title: "GAN-Based Random Image Generator",
    subtitle: "PyTorch GAN producing realistic 64×64 images with custom CNN architectures",
    category: "AI / ML",
    tags: ["Python", "PyTorch", "GANs", "CNN", "Deep Learning"],
    emoji: "◐",
    gradient: "from-zinc-900 to-stone-900",
    featured: true,
    year: "2025",
    overview:
      "A generative adversarial network built from scratch in PyTorch that produces realistic 64×64 artificial images. Designed with custom CNN architectures for both discriminator and generator, and optimized for stable training convergence.",
    challenge:
      "Training GANs is notoriously unstable — mode collapse, vanishing gradients, and oscillating loss curves are common failure modes. Building a reliable training loop that converges to high-quality image generation requires careful architecture and hyperparameter decisions.",
    solution:
      "Designed custom CNN architectures for both generator and discriminator. Applied batch normalization throughout, tuned learning rates separately for each network, and used binary cross-entropy loss with Adam optimizer for stable adversarial training.",
    architecture:
      "Generator: latent vector (100-dim) → FC → reshape → 4× transposed conv layers (BN + ReLU) → Tanh output. Discriminator: 4× conv layers (BN + LeakyReLU) → FC → Sigmoid. Training loop: alternating D and G updates with gradient penalty.",
    outcomes: [
      "20% improvement in model convergence through batch normalization and LR tuning",
      "Realistic 64×64 image generation from random latent vectors",
      "Stable training loop without mode collapse",
      "Clean implementation serving as a reusable GAN baseline",
    ],
    lessons:
      "Training stability is 80% architecture and 20% hyperparameters. Separate learning rates for generator (0.0002) and discriminator (0.0001) made the biggest difference — an equal LR almost always leads to one network dominating.",
    stack: ["Python", "PyTorch", "CNN", "Adam Optimizer", "Binary Cross-Entropy", "CUDA", "Matplotlib"],
    links: [{ label: "GitHub", href: personal.github }],
  },
  {
    slug: "fullstack-web-apps",
    title: "Full Stack Web Applications",
    subtitle: "Dynamic web applications built with React.js, Node.js, and MongoDB at Tech Mahindra",
    category: "Full Stack",
    tags: ["React.js", "Node.js", "MongoDB", "Docker", "Jenkins"],
    emoji: "◎",
    gradient: "from-stone-800 to-zinc-900",
    featured: true,
    year: "2024",
    overview:
      "Full-stack web applications developed during the Java Full Stack internship at Tech Mahindra. Focused on building dynamic, database-backed interfaces using React.js and Node.js, with CI/CD automation and significant API performance improvements.",
    challenge:
      "The existing applications had slow API response times and fragile deployment processes. Database queries were unoptimized, leading to high latency under load, and there was no automated testing or deployment pipeline in place.",
    solution:
      "Refactored backend API layer with optimized MongoDB queries and indexing strategies. Implemented CI/CD pipelines using Docker and Jenkins. Introduced Agile practices and code review workflows across the team.",
    architecture:
      "React.js frontend → Node.js/Express REST API → MongoDB Atlas. Docker containers for consistent environments. Jenkins pipeline: lint → test → build Docker image → deploy to staging → prod.",
    outcomes: [
      "25% reduction in system latency through API and query optimization",
      "Automated CI/CD pipeline with Docker and Jenkins",
      "Improved team velocity through Agile practices",
      "Enhanced application functionality and user experience",
    ],
    lessons:
      "Most latency wins come from the database layer, not the application layer. Adding compound indexes on the most common query patterns eliminated nearly all of the slow queries before any code-level optimization was needed.",
    stack: ["React.js", "Node.js", "Express", "MongoDB", "Docker", "Jenkins", "REST APIs"],
    links: [{ label: "GitHub", href: personal.github }],
  },
  {
    slug: "restapi-springboot",
    title: "RESTful API — Spring Boot",
    subtitle: "Scalable backend API with Spring Boot, MySQL, and JWT authentication",
    category: "Backend",
    tags: ["Java", "Spring Boot", "MySQL", "REST APIs", "JWT"],
    emoji: "◇",
    gradient: "from-zinc-800 to-neutral-900",
    featured: false,
    year: "2024",
    overview:
      "A production-grade RESTful API built with Spring Boot, featuring JWT authentication, MySQL persistence, and a clean layered architecture. Designed with performance and maintainability in mind.",
    challenge:
      "Building a secure, maintainable backend API that handles authentication, data validation, and error handling consistently — while remaining easy to extend as requirements grow.",
    solution:
      "Implemented a layered Spring Boot architecture (Controller → Service → Repository) with JPA/Hibernate for ORM, Spring Security for JWT auth, and global exception handling for clean error responses.",
    architecture:
      "Client → Spring Security filter (JWT validation) → Controllers → Services → JPA Repositories → MySQL. Global exception handler returns structured error responses. Flyway for database migrations.",
    outcomes: [
      "Clean, documented API with Swagger/OpenAPI spec",
      "Secure JWT authentication with refresh token support",
      "Consistent error handling across all endpoints",
      "Tested with JUnit and Mockito",
    ],
    lessons:
      "Investing in a proper service layer from the start pays dividends immediately. Every time a controller calls the repository directly, you pay the cost in testing complexity and tight coupling.",
    stack: ["Java", "Spring Boot", "MySQL", "JPA / Hibernate", "Spring Security", "JWT", "JUnit", "Maven"],
    links: [{ label: "GitHub", href: personal.github }],
  },
];

export const experience = [
  {
    id: "techmahindra",
    role: "Java Full Stack Intern",
    company: "Tech Mahindra",
    companyType: "IT Services",
    period: "Oct 2023 – Feb 2024",
    duration: "5 months",
    location: "Vizag, India",
    description:
      "Contributed to the development of dynamic web applications using React.js, Node.js, and MongoDB. Collaborated with team members to implement Agile practices and CI/CD automation.",
    bullets: [
      "Built and enhanced dynamic web applications using React.js, Node.js, and MongoDB, improving functionality and user experience",
      "Implemented Agile practices and CI/CD pipelines using Docker and Jenkins across the engineering team",
      "Optimized database queries and improved API performance, reducing system latency by 25%",
    ],
    stack: ["React.js", "Node.js", "MongoDB", "Docker", "Jenkins", "REST APIs", "Agile"],
    highlight: "−25% latency",
  },
];

export const education = [
  {
    degree: "Master of Science in Computer Science",
    school: "Cleveland State University",
    location: "Cleveland, OH",
    period: "Aug 2024 – May 2026",
    notes: "Focus: Data Structures, System Design, AI/ML, Full-Stack Development",
  },
  {
    degree: "Bachelor of Science in Information Technology",
    school: "JNTU",
    location: "India",
    period: "Jun 2019 – May 2023",
    notes: "Core coursework in programming, databases, networking, and software engineering",
  },
];

export const certifications: { name: string; year: string }[] = [];

export const techPhilosophy = [
  {
    title: "Performance by design",
    body: "Latency problems are almost always architectural, not algorithmic. Design data access patterns first; optimize code second.",
  },
  {
    title: "Build to understand",
    body: "The best way to learn a technology deeply is to build something real with it — not follow a tutorial, but solve an actual problem.",
  },
  {
    title: "Clarity over cleverness",
    body: "Code that reads like documentation is infinitely more valuable than clever one-liners. Future-you will be grateful.",
  },
  {
    title: "Ship, then iterate",
    body: "A working system in production teaches you more in a week than a perfect design in a notebook teaches you in a month.",
  },
];
