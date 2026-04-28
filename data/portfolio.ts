
export const portfolioData = {
  name: "Aswin Sanosh",
  title: "Software Developer",
  tagline: "Full Stack · AI/ML · Real-Time Systems",
  email: "aswinsanosh97@gmail.com",
  phone: "+91 89439 63650",
  linkedin: "linkedin.com/in/aswinsanosh",
  github: "github.com/AswinSanosh",
  location: "Makkaparambil House, Maliankara P O, Moothakunnam, North Paravur, Ernakulam (Kochi), Kerala, India - 683516",

  summary: `Full Stack Developer and AI/ML Engineer with strong experience in building scalable web applications, real-time systems, and intelligent data-driven solutions. Proficient in developing end-to-end platforms using Django, React.js, and modern backend frameworks, with hands-on expertise in computer vision, unsupervised learning, and physics-informed AI models. Experienced in integrating real-time data pipelines, REST APIs, and IoT systems for practical applications including stock prediction, flood forecasting, and smart transport systems. Adept at mentoring teams, optimizing system performance, and delivering production-ready solutions in research-driven and startup environments.`,

  skills: {
    languages: [
      "Python", "JavaScript", "Java", "C++", "C", "SQL", "Dart", "HTML/CSS"
    ],
    frameworks: [
      "Django", "Django REST Framework", "React.js", "Next.js", "Node.js", "Express.js", "NestJS", "Flutter", "React Native", "Three.js", "Tailwind CSS"
    ],
    ai_ml_data: [
      "NumPy", "Pandas", "SciPy", "Scikit-learn", "TensorFlow", "PyTorch", "OpenCV", "YOLOv8", "Hugging Face Transformers", "MLflow"
    ],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Firebase", "Supabase"],
    cloud: [],
    tools: [
      "Git", "VS Code", "PyCharm", "Google Colab", "Figma", "Blender", "Arduino IDE"
    ],
    domains: [
      "Full-Stack Development", "AI/ML", "IoT", "Computer Vision", "Real-Time Systems", "3D Modeling", "3D Printing", "Animation"
    ],
  },

  projects: [
    {
      id: "flood-twin",
      name: "Digital Twin for Flood Inundation (Physics-Informed AI)",
      subtitle: "Real-time flood prediction system",
      description:
        "Developed a physics-informed digital twin for flood inundation forecasting on unstructured meshes using graph neural networks. Integrated HEC-RAS hydrodynamic outputs with terrain and rainfall data, enforcing physical constraints through custom loss functions for stable, interpretable predictions.",
      tech: ["Python", "PyTorch", "Graph Neural Networks", "HEC-RAS"],
      highlight: true,
      icon: "🌊",
      color: "#4fc1ff",
    },
    {
      id: "stock-prediction",
      name: "Stock Prediction Website",
      subtitle: "Full-stack platform for stock analysis",
      description:
        "Built a full-stack stock prediction platform with pattern detection, visual analytics, REST APIs, and real-time alerts.",
      tech: ["React.js", "Django", "PostgreSQL"],
      highlight: true,
      icon: "📈",
      color: "#dcdcaa",
    },
    {
      id: "body-shape",
      name: "Body Shape Classification",
      subtitle: "3D body geometry extraction",
      description:
        "Developed an AI-based body shape classification system using pose estimation, body geometry extraction, and anthropometric analysis for fit recommendations.",
      tech: ["Python", "OpenCV", "OpenPose", "Shapy AI"],
      highlight: false,
      icon: "🧍",
      color: "#6a9955",
    },
    {
      id: "gpr-image",
      name: "GPR Image Classification",
      subtitle: "Unsupervised clustering pipeline",
      description:
        "Designed an unsupervised learning pipeline to classify road-distress patterns from GPR imagery for subsurface damage analysis. Combined feature extraction using DINOv3 and CNN backbones with clustering methods such as DBSCAN, BIRCH, and K-Means.",
      tech: ["Python", "Keras", "DINOv3", "DBSCAN", "BIRCH", "K-Means"],
      highlight: false,
      icon: "🛣️",
      color: "#ce9178",
    },
    {
      id: "industrial-tool",
      name: "Industrial Tool Classification",
      subtitle: "Real-time detection using traditional CV",
      description:
        "Built a real-time industrial tool classification system using HOG and Hu Moments in OpenCV for manufacturing and inspection workflows.",
      tech: ["C++", "OpenCV", "HOG", "Hu Moments"],
      highlight: false,
      icon: "🔧",
      color: "#c586c0",
    },
    {
      id: "bus-tracking",
      name: "Bus Tracking Website",
      subtitle: "GPS-based real-time tracking + ticketing system",
      description:
        "Developed a real-time bus tracking and ticketing platform with GPS-based live tracking.",
      tech: ["Next.js", "IoT", "GPS"],
      highlight: false,
      icon: "🚌",
      color: "#9cdcfe",
    },
    {
      id: "samyuktha",
      name: "Samyuktha 2025 Website",
      subtitle: "College fest platform",
      description:
        "Built the official event platform for a college techno-cultural fest with registrations, announcements, participant dashboards, and coordination workflows.",
      tech: ["Next.js", "Redux", "Tailwind CSS", "MySQL"],
      highlight: false,
      icon: "🎉",
      color: "#dcdcaa",
    },
    {
      id: "cansat",
      name: "CANSAT Flight Software",
      subtitle: "Telemetry dashboards and anomaly detection",
      description:
        "Engineered flight software with telemetry dashboards, anomaly detection, and alerting workflows using ESP32-based microcontrollers and thermal sensor data for satellite operations.",
      tech: ["Django", "React.js", "MySQL", "ESP32", "IoT"],
      highlight: false,
      icon: "🛰️",
      color: "#4fc1ff",
    },
    {
      id: "helekin",
      name: "Helekin Technologies Website",
      subtitle: "3D printing e-commerce platform",
      description:
        "Built a 3D-printing e-commerce platform with interactive model customization, order tracking, and product management workflows.",
      tech: ["Next.js", "Three.js", "MySQL"],
      highlight: false,
      icon: "🖨️",
      color: "#6a9955",
    },
    {
      id: "redwills",
      name: "Redwills Interactive Website",
      subtitle: "3D interactive portfolio for game studio",
      description:
        "Developed an immersive studio website with interactive 3D visuals and a narrative-driven experience aligned with gaming aesthetics.",
      tech: ["Next.js", "Three.js", "WebGL"],
      highlight: false,
      icon: "🎮",
      color: "#ce9178",
    },
  ],

  experience: [
    {
      role: "Intern",
      company: "National Chung Cheng University, Minxiong, Chiayi, Taiwan",
      period: "Dec 2025 – Mar 2026",
      type: "Internship",
      description: "Digital twin design for flood inundation using physics-informed neural networks.",
      tech: ["Physics-Informed Neural Networks", "Digital Twin", "Python", "PyTorch"],
      achievements: [],
    },
    {
      role: "Software Mentor and Developer",
      company: "Tessat Space Pvt. Ltd. (Startup), Kottayam, Kerala, India",
      period: "Feb 2025 – Present",
      type: "Full-Time",
      description: "Mentoring software development team. Developing full-stack applications and conducting AI/ML research.",
      tech: ["Full-Stack", "AI/ML"],
      achievements: [],
    },
    {
      role: "Web-Master",
      company: "IEEE Computer Society Student Chapter, Saintgits College of Engineering",
      period: "Dec 2024 – Dec 2025",
      type: "Part-Time",
      description: "Implemented web solutions for events, announcements, and engagement.",
      tech: ["Web Development"],
      achievements: [],
    },
    {
      role: "Intern",
      company: "National Chung Cheng University, Taiwan",
      period: "July 2024 – Sep 2024",
      type: "Internship",
      description: "Developed a stock prediction website using Django and React.js.",
      tech: ["Django", "React.js"],
      achievements: [],
    },
    {
      role: "Teacher (Part Time)",
      company: "Gurukulam Tuition Center, Kottayam, Kerala, India",
      period: "Feb 2024 – Dec 2025",
      type: "Part-Time",
      description: "Taught Computer Science (C++, Website Development, Networking) for 12th standard students. Taught Physics, Chemistry and Mathematics for 10th standard CBSE students.",
      tech: ["C++", "Web Development", "Networking"],
      achievements: [],
    },
    {
      role: "Chief Marketing Officer",
      company: "IEDC@Saintgits, Kottayam, Kerala, India",
      period: "July 2023 – Feb 2024",
      type: "Leadership",
      description: "Chief Marketing Officer",
      tech: [],
      achievements: [],
    },
  ],

  education: [
    {
      degree: "Master of Computer Applications",
      institution: "Saintgits College of Engineering, Kottayam",
      period: "2021 – 2026",
      location: "Kerala, India",
      score: "CGPA: 7.54/10",
    },
    {
      degree: "Plus Two (Senior Secondary)",
      institution: "Bharatiya Vidya Bhavans Vidya Mandir, Thrissur",
      period: "2020 – 2021",
      location: "Kerala, India",
      score: "80%",
    },
    {
      degree: "Tenth Standard (Higher Secondary)",
      institution: "Mount Carmel Vidhyaniketan, Kottayam",
      period: "2018 – 2019",
      location: "Kerala, India",
      score: "CGPA: 91.4%",
    },
  ],

  certifications: [
    { name: "Developing Applications with SQL, Databases, and Django – Coursera", icon: "💻" },
    { name: "Python for Machine Learning & Data Science – Udemy", icon: "🤖" },
    { name: "Electronics and PCB Design – Udemy", icon: "🔌" },
    { name: "Winner – Meta SparkAR Competition (April 2021)", icon: "🏆" },
  ],

  softSkills: [
    "Problem Solving", "Critical Thinking", "Leadership", "Technical Mentoring", "Team Collaboration", "Innovation Management", "Communication", "Adaptability", "Analytical Thinking", "Continuous Learning"
  ],

  languages: ["English", "Malayalam"],
};

export type Project = (typeof portfolioData.projects)[0];
