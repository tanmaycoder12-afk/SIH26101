# GyanSetu Technical Competency Framework Documentation (v1.0)

## 1. Overview & Metadata
* **Framework Name:** GyanSetu Generic Technical Competency Framework
* **Version:** 1.0
* **Target Domain:** Technical & Engineering Competencies

### Proficiency Scale
| Level | Name | Description |
| :---: | :--- | :--- |
| **1** | **Basic** | Fundamental understanding; requires guidance. |
| **2** | **Developing** | Standard tasks; requires minimal guidance. |
| **3** | **Proficient** | Independent execution; handles standard problem-solving. |
| **4** | **Advanced** | Complex tasks, performance optimization, and architectural decisions. |

---

## 2. JSON Data Structure & Hierarchy
root (Object)
├── frameworkName (String)
├── version (String)
├── proficiencyLevels (Array of Objects)
│   ├── level (Number)
│   ├── name (String)
│   └── description (String)
└── roles (Array of Objects)
├── roleId (String)
├── roleName (String)
└── competencies (Array of Objects)
├── competencyId (String)
├── name (String)
└── descriptions (Object)
├── basic (String)
├── developing (String)
├── proficient (String)
└── advanced (String)

---

## 3. Role & Competency Index (Part 1 Logged Data)

| Role Name | Mapped Competencies |
| :--- | :--- |
| **Software Developer** | Programming, Software Design, Software Testing |
| **Frontend Developer** | Web Development, Frontend Frameworks, User Experience (UX) |
| **Backend Developer** | Backend Programming, Database Management, API Development, Security |
| **Data Analyst** | Data Processing, Statistical Analysis, Data Visualization |
| **DevOps Engineer** | CI/CD Pipelines, Containerization, System Monitoring |
| **Network Engineer** | Networking Fundamentals, Network Security, Troubleshooting |
| **Cybersecurity Analyst** | Security Fundamentals, Security Monitoring, Incident Response |
| **Computer Hardware Engineer** | Hardware Architecture, Hardware Troubleshooting, Embedded Systems |
| **System Administrator** | Operating System Administration, System Security, Backup & Recovery |

---

## 4. Complete JSON Data Schema Example

```json
{
  "frameworkName": "GyanSetu Generic Technical Competency Framework",
  "version": "1.0",
  "proficiencyLevels": [
    {
      "level": 1,
      "name": "Basic",
      "description": "Fundamental understanding; requires guidance."
    },
    {
      "level": 2,
      "name": "Developing",
      "description": "Standard tasks; requires minimal guidance."
    },
    {
      "level": 3,
      "name": "Proficient",
      "description": "Independent execution; handles standard problem-solving."
    },
    {
      "level": 4,
      "name": "Advanced",
      "description": "Complex tasks, performance optimization, and architectural decisions."
    }
  ],
  "roles": [
    {
      "roleId": "dev-software",
      "roleName": "Software Developer",
      "competencies": [
        {
          "competencyId": "comp-programming",
          "name": "Programming",
          "descriptions": {
            "basic": "Basic syntax understanding and simple script writing.",
            "developing": "Writes clean modular code with minimal supervision.",
            "proficient": "Builds robust software applications independently.",
            "advanced": "Architects codebases, leads code reviews, and optimizes performance."
          }
        }
      ]
    }
  ]
}
'''
<FollowUp label="Ready to provide Part 2 of the framework data?" query="Here is Part 2 of the GyanSetu Generic Technical Competency Framework JSON data."/>
