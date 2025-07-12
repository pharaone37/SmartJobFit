import { createContext, useContext } from 'react';

export type Language = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    pricing: string;
    features: string;
    help: string;
    login: string;
    dashboard: string;
    logout: string;
  };
  
  // Landing page
  landing: {
    heroTitle: string;
    heroDescription: string;
    searchPlaceholder: string;
    searchButton: string;
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      freeTrial: string;
    };
    stats: {
      jobs: string;
      users: string;
      interviews: string;
      matches: string;
    };
    features: {
      title: string;
      subtitle: string;
      aiSearch: {
        title: string;
        description: string;
        features: string[];
      };
      resumeOptimization: {
        title: string;
        description: string;
        features: string[];
      };
      interviewPrep: {
        title: string;
        description: string;
        features: string[];
      };
      analytics: {
        title: string;
        description: string;
      };
    };
    dashboard: {
      title: string;
      subtitle: string;
    };
    interviewFeatures: {
      title: string;
      mockInterviews: {
        title: string;
        description: string;
        features: string[];
      };
      questionBank: {
        title: string;
        description: string;
        features: string[];
      };
      salaryNegotiation: {
        title: string;
        description: string;
        features: string[];
      };
    };
    testimonials: {
      title: string;
      subtitle: string;
      reviews: {
        name: string;
        role: string;
        content: string;
      }[];
    };
    pricing: {
      title: string;
      subtitle: string;
      monthly: string;
      yearly: string;
      mostPopular: string;
      free: {
        title: string;
        price: string;
        description: string;
        features: string[];
        buttonText: string;
      };
      professional: {
        title: string;
        price: string;
        description: string;
        features: string[];
        buttonText: string;
      };
      enterprise: {
        title: string;
        price: string;
        description: string;
        features: string[];
        buttonText: string;
      };
    };
    faq: {
      title: string;
      questions: {
        question: string;
        answer: string;
      }[];
    };
  };
  
  // Dashboard
  dashboard: {
    welcome: string;
    quickActions: string;
    recentActivity: string;
    analytics: string;
    jobSearches: string;
    applications: string;
    interviews: string;
    resumeScore: string;
    profileStrength: string;
    matchingJobs: string;
    cvAnalysis: string;
    interviewPrep: string;
    jobMatching: string;
    upgrade: string;
    findJobs: string;
    optimizeResume: string;
    practiceInterview: string;
    viewAnalytics: string;
    applicationStats: string;
    successRate: string;
    responseRate: string;
    interviewsScheduled: string;
  };
  
  // Common
  common: {
    getStarted: string;
    learnMore: string;
    upgrade: string;
    cancel: string;
    save: string;
    loading: string;
    error: string;
    success: string;
    search: string;
    filter: string;
    apply: string;
    view: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    submit: string;
    tryFree: string;
    contactSales: string;
    signUp: string;
    signIn: string;
  };
  
  // Footer
  footer: {
    company: string;
    tagline: string;
    features: string;
    aiJobSearch: string;
    resumeOptimization: string;
    interviewPreparation: string;
    pricing: string;
    support: string;
    helpCenter: string;
    copyright: string;
  };

  // Help Center
  help: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: {
      gettingStarted: string;
      accountManagement: string;
      billing: string;
      troubleshooting: string;
    };
    articles: {
      title: string;
      description: string;
    }[];
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      pricing: 'Pricing',
      features: 'Features',
      help: 'Help',
      login: 'Login',
      dashboard: 'Dashboard',
      logout: 'Logout'
    },
    landing: {
      heroTitle: 'Find Your Dream Job 10x Faster with AI',
      heroDescription: 'Search 1M+ jobs from 15+ sources. AI-optimized resumes. Smart matching. One-click applications. The future of job search is here.',
      searchPlaceholder: 'Search for jobs, companies, or skills...',
      searchButton: 'Search Jobs',
      hero: {
        title: 'Find Your Dream Job 10x Faster with AI',
        subtitle: 'SmartJobFit uses advanced AI to match you with perfect job opportunities, optimize your resume, and prepare you for interviews.',
        cta: 'Get Started Free',
        freeTrial: 'Start Free Trial'
      },
      stats: {
        jobs: '1M+ Jobs',
        users: '50K+ Users',
        interviews: '5x More Interviews',
        matches: '1M+ Job Matches Found'
      },
      features: {
        title: 'Powerful AI-Driven Features',
        subtitle: 'Everything you need to land your dream job',
        aiSearch: {
          title: 'AI Job Search',
          description: 'Search across 15+ job boards with AI-powered matching and get personalized recommendations.',
          features: ['Smart job matching', 'Personalized recommendations', 'Real-time alerts']
        },
        resumeOptimization: {
          title: 'Resume Optimization',
          description: 'AI-powered resume analysis and ATS optimization to increase your response rate.',
          features: ['ATS optimization', 'Keyword analysis', 'Industry-specific tips']
        },
        interviewPrep: {
          title: 'Interview Preparation',
          description: 'AI coach for mock interviews and personalized feedback to ace your interviews.',
          features: ['Mock interviews', 'Real-time feedback', 'Industry questions']
        },
        analytics: {
          title: 'Advanced Analytics',
          description: 'Track your progress and optimize your strategy with detailed insights.'
        }
      },
      dashboard: {
        title: 'Your Personal Job Search Command Center',
        subtitle: 'Track everything in one beautiful, intelligent dashboard'
      },
      interviewFeatures: {
        title: 'Master Your Interviews',
        mockInterviews: {
          title: 'AI Mock Interviews',
          description: 'Practice with our AI interviewer that adapts to your industry and role. Get realistic interview experience.',
          features: ['Industry-specific questions', 'Real-time feedback', 'Voice & body language analysis']
        },
        questionBank: {
          title: 'Question Bank',
          description: 'Access 1000+ interview questions tailored to your role, with expert answers and explanations.',
          features: ['Behavioral questions', 'Technical challenges', 'Company-specific prep']
        },
        salaryNegotiation: {
          title: 'Salary Negotiation',
          description: 'Learn to negotiate like a pro with AI-powered coaching and market data insights.',
          features: ['Market salary data', 'Negotiation strategies', 'Practice scenarios']
        }
      },
      testimonials: {
        title: 'Trusted by Job Seekers Worldwide',
        subtitle: 'Join thousands who found their dream jobs with SmartJobFit',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Product Manager at TechCorp',
            content: 'SmartJobFit helped me land my dream job in just 3 weeks! The AI resume optimization increased my response rate by 300%.'
          },
          {
            name: 'Michael Chen',
            role: 'Software Engineer at StartupCo',
            content: 'The interview prep AI was incredible. I felt confident going into my interviews and nailed every one. Highly recommended!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'UX Designer at DesignStudio',
            content: 'Amazing platform! The salary negotiation coaching helped me get 25% more than my initial offer. Worth every penny!'
          }
        ]
      },
      pricing: {
        title: 'Choose Your Plan',
        subtitle: 'Start free, upgrade when you\'re ready to accelerate your career',
        monthly: 'Monthly',
        yearly: 'Yearly',
        mostPopular: 'Most Popular',
        free: {
          title: 'Free',
          price: '$0',
          description: 'Perfect for getting started',
          features: ['5 AI job searches per month', 'Basic resume optimization', 'Limited job board access', 'Email support'],
          buttonText: 'Get Started Free'
        },
        professional: {
          title: 'Professional',
          price: '$29',
          description: 'For serious job seekers',
          features: ['Unlimited AI job searches', 'Advanced resume optimization', 'All 15+ job board access', 'AI interview preparation', 'Priority support', 'Analytics dashboard'],
          buttonText: 'Upgrade to Professional'
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            question: 'How does SmartJobFit\'s AI job matching work?',
            answer: 'Our AI analyzes your skills, experience, and preferences to match you with the most relevant job opportunities from 15+ job boards. It learns from your interactions to improve recommendations over time.'
          },
          {
            question: 'Can I cancel my subscription at any time?',
            answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your billing period.'
          },
          {
            question: 'How does the resume optimization work?',
            answer: 'Our AI analyzes your resume against industry standards and job descriptions, providing specific recommendations for keywords, formatting, and content to improve your ATS score and response rate.'
          },
          {
            question: 'Is my data secure?',
            answer: 'Absolutely. We use enterprise-grade security measures to protect your personal information. Your data is encrypted and never shared with third parties without your explicit consent.'
          },
          {
            question: 'Do you offer a money-back guarantee?',
            answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Welcome back',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      analytics: 'Analytics',
      jobSearches: 'Job Searches',
      applications: 'Applications',
      interviews: 'Interviews',
      resumeScore: 'Resume Score',
      profileStrength: 'Profile Strength',
      matchingJobs: 'Matching Jobs',
      cvAnalysis: 'CV Analysis',
      interviewPrep: 'Interview Prep',
      jobMatching: 'Job Matching',
      upgrade: 'Upgrade Plan',
      findJobs: 'Find Jobs',
      optimizeResume: 'Optimize Resume',
      practiceInterview: 'Practice Interview',
      viewAnalytics: 'View Analytics',
      applicationStats: 'Application Stats',
      successRate: 'Success Rate',
      responseRate: 'Response Rate',
      interviewsScheduled: 'Interviews Scheduled'
    },
    common: {
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      upgrade: 'Upgrade',
      cancel: 'Cancel',
      save: 'Save',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      search: 'Search',
      filter: 'Filter',
      apply: 'Apply',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      submit: 'Submit',
      tryFree: 'Try Free',
      contactSales: 'Contact Sales',
      signUp: 'Sign Up',
      signIn: 'Sign In'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'The future of job search is here. Find your dream job 10x faster with AI-powered matching and optimization.',
      features: 'Features',
      aiJobSearch: 'AI Job Search',
      resumeOptimization: 'Resume Optimization',
      interviewPreparation: 'Interview Preparation',
      pricing: 'Pricing',
      support: 'Support',
      helpCenter: 'Help Center',
      copyright: '© 2024 SmartJobFit. All rights reserved.'
    },
    help: {
      title: 'Help Center',
      subtitle: 'Find answers to your questions and learn how to get the most out of SmartJobFit',
      searchPlaceholder: 'Search for help...',
      categories: {
        gettingStarted: 'Getting Started',
        accountManagement: 'Account Management',
        billing: 'Billing & Subscription',
        troubleshooting: 'Troubleshooting'
      },
      articles: [
        {
          title: 'Getting Started with SmartJobFit',
          description: 'Learn how to create your account and start your job search journey'
        },
        {
          title: 'Optimizing Your Resume',
          description: 'Best practices for creating an ATS-friendly resume'
        },
        {
          title: 'Using AI Job Search',
          description: 'How to leverage our AI-powered job matching system'
        },
        {
          title: 'Interview Preparation Guide',
          description: 'Prepare for success with our AI interview coach'
        }
      ]
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      pricing: 'Preise',
      features: 'Funktionen',
      help: 'Hilfe',
      login: 'Anmelden',
      dashboard: 'Dashboard',
      logout: 'Abmelden'
    },
    landing: {
      heroTitle: 'Finden Sie Ihren Traumjob 10x schneller mit KI',
      heroDescription: 'Durchsuchen Sie 1M+ Jobs von 15+ Quellen. KI-optimierte Lebensläufe. Intelligente Zuordnung. Ein-Klick-Bewerbungen. Die Zukunft der Jobsuche ist hier.',
      searchPlaceholder: 'Suchen Sie nach Jobs, Unternehmen oder Fähigkeiten...',
      searchButton: 'Jobs suchen',
      hero: {
        title: 'Finden Sie Ihren Traumjob 10x schneller mit KI',
        subtitle: 'SmartJobFit nutzt fortschrittliche KI, um Sie mit perfekten Stellenangeboten zu verbinden, Ihren Lebenslauf zu optimieren und Sie auf Vorstellungsgespräche vorzubereiten.',
        cta: 'Kostenlos starten',
        freeTrial: 'Kostenlose Testversion starten'
      },
      stats: {
        jobs: '1M+ Jobs',
        users: '50K+ Nutzer',
        interviews: '5x mehr Interviews',
        matches: '1M+ Job-Matches gefunden'
      },
      features: {
        title: 'Leistungsstarke KI-gesteuerte Funktionen',
        subtitle: 'Alles, was Sie brauchen, um Ihren Traumjob zu bekommen',
        aiSearch: {
          title: 'KI-Jobsuche',
          description: 'Suchen Sie auf 15+ Jobbörsen mit KI-gesteuertem Matching und erhalten Sie personalisierte Empfehlungen.',
          features: ['Intelligente Job-Zuordnung', 'Personalisierte Empfehlungen', 'Echtzeit-Benachrichtigungen']
        },
        resumeOptimization: {
          title: 'Lebenslauf-Optimierung',
          description: 'KI-gesteuerte Lebenslauf-Analyse und ATS-Optimierung zur Steigerung Ihrer Antwortrate.',
          features: ['ATS-Optimierung', 'Keyword-Analyse', 'Branchenspezifische Tipps']
        },
        interviewPrep: {
          title: 'Vorstellungsgespräch-Vorbereitung',
          description: 'KI-Coach für Probegespräche und personalisiertes Feedback, um Ihre Interviews zu meistern.',
          features: ['Probegespräche', 'Echtzeit-Feedback', 'Branchenfragen']
        },
        analytics: {
          title: 'Erweiterte Analysen',
          description: 'Verfolgen Sie Ihren Fortschritt und optimieren Sie Ihre Strategie mit detaillierten Einblicken.'
        }
      },
      dashboard: {
        title: 'Ihr persönliches Job-Such-Kommandozentrum',
        subtitle: 'Verfolgen Sie alles in einem schönen, intelligenten Dashboard'
      },
      interviewFeatures: {
        title: 'Meistern Sie Ihre Interviews',
        mockInterviews: {
          title: 'KI-Probegespräche',
          description: 'Üben Sie mit unserem KI-Interviewer, der sich an Ihre Branche und Rolle anpasst. Erhalten Sie realistische Interview-Erfahrung.',
          features: ['Branchenspezifische Fragen', 'Echtzeit-Feedback', 'Stimm- und Körpersprache-Analyse']
        },
        questionBank: {
          title: 'Fragenbank',
          description: 'Zugriff auf 1000+ Interview-Fragen, die auf Ihre Rolle zugeschnitten sind, mit Expertenantworten und Erklärungen.',
          features: ['Verhaltensfragen', 'Technische Herausforderungen', 'Unternehmensspezifische Vorbereitung']
        },
        salaryNegotiation: {
          title: 'Gehaltsverhandlung',
          description: 'Lernen Sie wie ein Profi zu verhandeln mit KI-gestütztem Coaching und Marktdaten-Einblicken.',
          features: ['Markt-Gehaltsdaten', 'Verhandlungsstrategien', 'Übungsszenarien']
        }
      },
      testimonials: {
        title: 'Vertraut von Jobsuchenden weltweit',
        subtitle: 'Schließen Sie sich Tausenden an, die ihren Traumjob mit SmartJobFit gefunden haben',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Produktmanagerin bei TechCorp',
            content: 'SmartJobFit hat mir geholfen, meinen Traumjob in nur 3 Wochen zu bekommen! Die KI-Lebenslauf-Optimierung hat meine Antwortrate um 300% gesteigert.'
          },
          {
            name: 'Michael Chen',
            role: 'Software-Ingenieur bei StartupCo',
            content: 'Die Interview-Vorbereitungs-KI war unglaublich. Ich fühlte mich selbstbewusst in meine Interviews zu gehen und habe alle gemeistert. Sehr empfehlenswert!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'UX-Designerin bei DesignStudio',
            content: 'Erstaunliche Plattform! Das Gehaltsverhandlungs-Coaching hat mir geholfen, 25% mehr als mein ursprüngliches Angebot zu bekommen. Jeden Cent wert!'
          }
        ]
      },
      pricing: {
        title: 'Wählen Sie Ihren Plan',
        subtitle: 'Kostenlos starten, upgraden wenn Sie bereit sind, Ihre Karriere zu beschleunigen',
        monthly: 'Monatlich',
        yearly: 'Jährlich',
        mostPopular: 'Beliebteste',
        free: {
          title: 'Kostenlos',
          price: '0€',
          description: 'Perfekt für den Einstieg',
          features: ['5 KI-Jobsuchen pro Monat', 'Grundlegende Lebenslauf-Optimierung', 'Begrenzter Jobbörsen-Zugang', 'E-Mail-Support'],
          buttonText: 'Kostenlos starten'
        },
        professional: {
          title: 'Professional',
          price: '29€',
          description: 'Für ernsthafte Jobsuchende',
          features: ['Unbegrenzte KI-Jobsuchen', 'Erweiterte Lebenslauf-Optimierung', 'Alle 15+ Jobbörsen-Zugang', 'KI-Vorstellungsgespräch-Vorbereitung', 'Prioritäts-Support', 'Analytics-Dashboard'],
          buttonText: 'Auf Professional upgraden'
        },
        enterprise: {
          title: 'KI-Karriere-Coach',
          price: '79€',
          description: 'Für Karriere-Profis',
          features: ['Alles in Professional', 'Erweiterte Analysen', 'KI-Gehaltsverhandlungs-Coaching', '24/7 KI-Karriere-Agent-Coaching', 'KI-gesteuerte strategische Planung', 'Benutzerdefinierte KI-Integrationen'],
          buttonText: 'Auf KI-Karriere-Coach upgraden'
        }
      },
      faq: {
        title: 'Häufig gestellte Fragen',
        questions: [
          {
            question: 'Wie funktioniert SmartJobFits KI-Job-Matching?',
            answer: 'Unsere KI analysiert Ihre Fähigkeiten, Erfahrungen und Präferenzen, um Sie mit den relevantesten Stellenangeboten von 15+ Jobbörsen zu verbinden. Sie lernt aus Ihren Interaktionen, um Empfehlungen im Laufe der Zeit zu verbessern.'
          },
          {
            question: 'Kann ich mein Abonnement jederzeit kündigen?',
            answer: 'Ja, Sie können Ihr Abonnement jederzeit kündigen. Es gibt keine langfristigen Verträge oder Kündigungsgebühren. Ihr Abonnement bleibt bis zum Ende Ihres Abrechnungszeitraums aktiv.'
          },
          {
            question: 'Wie funktioniert die Lebenslauf-Optimierung?',
            answer: 'Unsere KI analysiert Ihren Lebenslauf gegen Branchenstandards und Stellenbeschreibungen und bietet spezifische Empfehlungen für Keywords, Formatierung und Inhalt, um Ihren ATS-Score und Ihre Antwortrate zu verbessern.'
          },
          {
            question: 'Sind meine Daten sicher?',
            answer: 'Absolut. Wir verwenden Sicherheitsmaßnahmen auf Unternehmensebene, um Ihre persönlichen Informationen zu schützen. Ihre Daten werden verschlüsselt und niemals ohne Ihre ausdrückliche Zustimmung an Dritte weitergegeben.'
          },
          {
            question: 'Bieten Sie eine Geld-zurück-Garantie?',
            answer: 'Ja, wir bieten eine 30-tägige Geld-zurück-Garantie auf alle bezahlten Pläne. Wenn Sie nicht zufrieden sind, kontaktieren Sie unser Support-Team für eine vollständige Rückerstattung.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Willkommen zurück',
      quickActions: 'Schnellaktionen',
      recentActivity: 'Kürzliche Aktivität',
      analytics: 'Analysen',
      jobSearches: 'Jobsuchen',
      applications: 'Bewerbungen',
      interviews: 'Vorstellungsgespräche',
      resumeScore: 'Lebenslauf-Score',
      profileStrength: 'Profil-Stärke',
      matchingJobs: 'Passende Jobs',
      cvAnalysis: 'CV-Analyse',
      interviewPrep: 'Vorstellungsgespräch-Vorbereitung',
      jobMatching: 'Job-Matching',
      upgrade: 'Plan upgraden',
      findJobs: 'Jobs finden',
      optimizeResume: 'Lebenslauf optimieren',
      practiceInterview: 'Interview üben',
      viewAnalytics: 'Analysen ansehen',
      applicationStats: 'Bewerbungsstatistiken',
      successRate: 'Erfolgsrate',
      responseRate: 'Antwortrate',
      interviewsScheduled: 'Interviews geplant'
    },
    common: {
      getStarted: 'Loslegen',
      learnMore: 'Mehr erfahren',
      upgrade: 'Upgraden',
      cancel: 'Abbrechen',
      save: 'Speichern',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      search: 'Suchen',
      filter: 'Filter',
      apply: 'Anwenden',
      view: 'Ansehen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      close: 'Schließen',
      submit: 'Absenden',
      tryFree: 'Kostenlos testen',
      contactSales: 'Vertrieb kontaktieren',
      signUp: 'Registrieren',
      signIn: 'Anmelden'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'Die Zukunft der Jobsuche ist hier. Finden Sie Ihren Traumjob 10x schneller mit KI-gesteuerten Matching und Optimierung.',
      features: 'Funktionen',
      aiJobSearch: 'KI-Jobsuche',
      resumeOptimization: 'Lebenslauf-Optimierung',
      interviewPreparation: 'Vorstellungsgespräch-Vorbereitung',
      pricing: 'Preise',
      support: 'Support',
      helpCenter: 'Hilfe-Center',
      copyright: '© 2024 SmartJobFit. Alle Rechte vorbehalten.'
    },
    help: {
      title: 'Hilfe-Center',
      subtitle: 'Finden Sie Antworten auf Ihre Fragen und lernen Sie, wie Sie das Beste aus SmartJobFit herausholen',
      searchPlaceholder: 'Suchen Sie nach Hilfe...',
      categories: {
        gettingStarted: 'Erste Schritte',
        accountManagement: 'Kontoverwaltung',
        billing: 'Abrechnung & Abonnement',
        troubleshooting: 'Fehlerbehebung'
      },
      articles: [
        {
          title: 'Erste Schritte mit SmartJobFit',
          description: 'Lernen Sie, wie Sie Ihr Konto erstellen und Ihre Jobsuche beginnen'
        },
        {
          title: 'Ihren Lebenslauf optimieren',
          description: 'Best Practices für die Erstellung eines ATS-freundlichen Lebenslaufs'
        },
        {
          title: 'KI-Jobsuche verwenden',
          description: 'Wie Sie unser KI-gestütztes Job-Matching-System nutzen'
        },
        {
          title: 'Vorstellungsgespräch-Vorbereitungshandbuch',
          description: 'Bereiten Sie sich mit unserem KI-Interview-Coach auf den Erfolg vor'
        }
      ]
    }
  },
  // Adding other languages with similar comprehensive structure...
  fr: {
    nav: {
      home: 'Accueil',
      pricing: 'Tarifs',
      features: 'Fonctionnalités',
      help: 'Aide',
      login: 'Connexion',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion'
    },
    landing: {
      heroTitle: 'Trouvez votre emploi de rêve 10x plus rapidement avec l\'IA',
      heroDescription: 'Recherchez 1M+ emplois de 15+ sources. CVs optimisés par IA. Correspondance intelligente. Candidatures en un clic. L\'avenir de la recherche d\'emploi est ici.',
      searchPlaceholder: 'Rechercher des emplois, entreprises ou compétences...',
      searchButton: 'Rechercher des emplois',
      hero: {
        title: 'Trouvez votre emploi de rêve 10x plus rapidement avec l\'IA',
        subtitle: 'SmartJobFit utilise l\'IA avancée pour vous connecter avec des opportunités d\'emploi parfaites, optimiser votre CV et vous préparer aux entretiens.',
        cta: 'Commencer gratuitement',
        freeTrial: 'Commencer l\'essai gratuit'
      },
      stats: {
        jobs: '1M+ Emplois',
        users: '50K+ Utilisateurs',
        interviews: '5x plus d\'entretiens',
        matches: '1M+ Correspondances d\'emploi trouvées'
      },
      features: {
        title: 'Fonctionnalités puissantes pilotées par l\'IA',
        subtitle: 'Tout ce dont vous avez besoin pour décrocher votre emploi de rêve',
        aiSearch: {
          title: 'Recherche d\'emploi IA',
          description: 'Recherchez sur 15+ sites d\'emploi avec correspondance IA et obtenez des recommandations personnalisées.',
          features: ['Correspondance d\'emploi intelligente', 'Recommandations personnalisées', 'Alertes en temps réel']
        },
        resumeOptimization: {
          title: 'Optimisation de CV',
          description: 'Analyse de CV et optimisation ATS pilotées par l\'IA pour augmenter votre taux de réponse.',
          features: ['Optimisation ATS', 'Analyse de mots-clés', 'Conseils spécifiques à l\'industrie']
        },
        interviewPrep: {
          title: 'Préparation d\'entretien',
          description: 'Coach IA pour entretiens simulés et commentaires personnalisés pour réussir vos entretiens.',
          features: ['Entretiens simulés', 'Commentaires en temps réel', 'Questions de l\'industrie']
        },
        analytics: {
          title: 'Analyses avancées',
          description: 'Suivez vos progrès et optimisez votre stratégie avec des insights détaillés.'
        }
      },
      dashboard: {
        title: 'Votre Centre de Commande Personnel de Recherche d\'Emploi',
        subtitle: 'Suivez tout dans un tableau de bord intelligent et élégant'
      },
      interviewFeatures: {
        title: 'Maîtrisez vos entretiens',
        mockInterviews: {
          title: 'Entretiens simulés IA',
          description: 'Entraînez-vous avec notre intervieweur IA qui s\'adapte à votre industrie et rôle. Obtenez une expérience d\'entretien réaliste.',
          features: ['Questions spécifiques à l\'industrie', 'Commentaires en temps réel', 'Analyse de la voix et du langage corporel']
        },
        questionBank: {
          title: 'Banque de questions',
          description: 'Accédez à 1000+ questions d\'entretien adaptées à votre rôle, avec des réponses d\'experts et des explications.',
          features: ['Questions comportementales', 'Défis techniques', 'Préparation spécifique à l\'entreprise']
        },
        salaryNegotiation: {
          title: 'Négociation salariale',
          description: 'Apprenez à négocier comme un pro avec un coaching IA et des insights de données de marché.',
          features: ['Données salariales du marché', 'Stratégies de négociation', 'Scénarios de pratique']
        }
      },
      testimonials: {
        title: 'Fait confiance par les chercheurs d\'emploi du monde entier',
        subtitle: 'Rejoignez des milliers de personnes qui ont trouvé leur emploi de rêve avec SmartJobFit',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Chef de produit chez TechCorp',
            content: 'SmartJobFit m\'a aidé à décrocher mon emploi de rêve en seulement 3 semaines ! L\'optimisation de CV par IA a augmenté mon taux de réponse de 300%.'
          },
          {
            name: 'Michael Chen',
            role: 'Ingénieur logiciel chez StartupCo',
            content: 'L\'IA de préparation d\'entretien était incroyable. Je me sentais confiant en allant à mes entretiens et j\'ai réussi tous. Fortement recommandé!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Designer UX chez DesignStudio',
            content: 'Plateforme incroyable ! Le coaching de négociation salariale m\'a aidé à obtenir 25% de plus que mon offre initiale. Ça vaut chaque centime!'
          }
        ]
      },
      pricing: {
        title: 'Choisissez votre plan',
        subtitle: 'Commencez gratuitement, mettez à niveau quand vous êtes prêt à accélérer votre carrière',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        mostPopular: 'Le plus populaire',
        free: {
          title: 'Gratuit',
          price: '0€',
          description: 'Parfait pour commencer',
          features: ['5 recherches d\'emploi IA par mois', 'Optimisation de CV de base', 'Accès limité aux sites d\'emploi', 'Support par e-mail'],
          buttonText: 'Commencer gratuitement'
        },
        professional: {
          title: 'Professionnel',
          price: '29€',
          description: 'Pour les chercheurs d\'emploi sérieux',
          features: ['Recherches d\'emploi IA illimitées', 'Optimisation de CV avancée', 'Accès à tous les 15+ sites d\'emploi', 'Préparation d\'entretien IA', 'Support prioritaire', 'Tableau de bord analytique'],
          buttonText: 'Passer au Professionnel'
        },
        enterprise: {
          title: 'Coach Carrière IA',
          price: '79€',
          description: 'Pour les professionnels de carrière',
          features: ['Tout dans Professionnel', 'Analyses avancées', 'Coaching de négociation salariale IA', 'Coaching d\'agent de carrière IA 24/7', 'Planification stratégique IA', 'Intégrations IA personnalisées'],
          buttonText: 'Passer au Coach Carrière IA'
        }
      },
      faq: {
        title: 'Questions fréquemment posées',
        questions: [
          {
            question: 'Comment fonctionne la correspondance d\'emploi IA de SmartJobFit?',
            answer: 'Notre IA analyse vos compétences, expérience et préférences pour vous faire correspondre avec les opportunités d\'emploi les plus pertinentes de 15+ sites d\'emploi. Elle apprend de vos interactions pour améliorer les recommandations au fil du temps.'
          },
          {
            question: 'Puis-je annuler mon abonnement à tout moment?',
            answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Il n\'y a pas de contrats à long terme ou de frais d\'annulation. Votre abonnement restera actif jusqu\'à la fin de votre période de facturation.'
          },
          {
            question: 'Comment fonctionne l\'optimisation de CV?',
            answer: 'Notre IA analyse votre CV par rapport aux normes de l\'industrie et aux descriptions d\'emploi, fournissant des recommandations spécifiques pour les mots-clés, le formatage et le contenu pour améliorer votre score ATS et votre taux de réponse.'
          },
          {
            question: 'Mes données sont-elles sécurisées?',
            answer: 'Absolument. Nous utilisons des mesures de sécurité de niveau entreprise pour protéger vos informations personnelles. Vos données sont chiffrées et ne sont jamais partagées avec des tiers sans votre consentement explicite.'
          },
          {
            question: 'Offrez-vous une garantie de remboursement?',
            answer: 'Oui, nous offrons une garantie de remboursement de 30 jours sur tous les plans payants. Si vous n\'êtes pas satisfait, contactez notre équipe de support pour un remboursement complet.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Bon retour',
      quickActions: 'Actions rapides',
      recentActivity: 'Activité récente',
      analytics: 'Analyses',
      jobSearches: 'Recherches d\'emploi',
      applications: 'Candidatures',
      interviews: 'Entretiens',
      resumeScore: 'Score de CV',
      profileStrength: 'Force du profil',
      matchingJobs: 'Emplois correspondants',
      cvAnalysis: 'Analyse CV',
      interviewPrep: 'Préparation entretien',
      jobMatching: 'Correspondance d\'emploi',
      upgrade: 'Mettre à niveau le plan',
      findJobs: 'Trouver des emplois',
      optimizeResume: 'Optimiser le CV',
      practiceInterview: 'Pratiquer l\'entretien',
      viewAnalytics: 'Voir les analyses',
      applicationStats: 'Statistiques de candidature',
      successRate: 'Taux de réussite',
      responseRate: 'Taux de réponse',
      interviewsScheduled: 'Entretiens programmés'
    },
    common: {
      getStarted: 'Commencer',
      learnMore: 'En savoir plus',
      upgrade: 'Mettre à niveau',
      cancel: 'Annuler',
      save: 'Sauvegarder',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      search: 'Rechercher',
      filter: 'Filtrer',
      apply: 'Appliquer',
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      submit: 'Soumettre',
      tryFree: 'Essayer gratuitement',
      contactSales: 'Contacter les ventes',
      signUp: 'S\'inscrire',
      signIn: 'Se connecter'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'L\'avenir de la recherche d\'emploi est ici. Trouvez votre emploi de rêve 10x plus rapidement avec correspondance et optimisation IA.',
      features: 'Fonctionnalités',
      aiJobSearch: 'Recherche d\'emploi IA',
      resumeOptimization: 'Optimisation de CV',
      interviewPreparation: 'Préparation d\'entretien',
      pricing: 'Tarifs',
      support: 'Support',
      helpCenter: 'Centre d\'aide',
      copyright: '© 2024 SmartJobFit. Tous droits réservés.'
    },
    help: {
      title: 'Centre d\'aide',
      subtitle: 'Trouvez des réponses à vos questions et apprenez à tirer le meilleur parti de SmartJobFit',
      searchPlaceholder: 'Rechercher de l\'aide...',
      categories: {
        gettingStarted: 'Commencer',
        accountManagement: 'Gestion de compte',
        billing: 'Facturation et abonnement',
        troubleshooting: 'Dépannage'
      },
      articles: [
        {
          title: 'Commencer avec SmartJobFit',
          description: 'Apprenez comment créer votre compte et commencer votre parcours de recherche d\'emploi'
        },
        {
          title: 'Optimiser votre CV',
          description: 'Meilleures pratiques pour créer un CV adapté aux ATS'
        },
        {
          title: 'Utiliser la recherche d\'emploi IA',
          description: 'Comment tirer parti de notre système de correspondance d\'emploi IA'
        },
        {
          title: 'Guide de préparation d\'entretien',
          description: 'Préparez-vous au succès avec notre coach d\'entretien IA'
        }
      ]
    }
  },
  // Adding Italian, Spanish, and Portuguese with same comprehensive structure
  it: {
    nav: {
      home: 'Home',
      pricing: 'Prezzi',
      features: 'Funzionalità',
      help: 'Aiuto',
      login: 'Accedi',
      dashboard: 'Dashboard',
      logout: 'Esci'
    },
    landing: {
      heroTitle: 'Trova il lavoro dei tuoi sogni 10x più velocemente con l\'IA',
      heroDescription: 'Cerca 1M+ lavori da 15+ fonti. CV ottimizzati dall\'IA. Abbinamento intelligente. Candidature con un clic. Il futuro della ricerca di lavoro è qui.',
      searchPlaceholder: 'Cerca lavori, aziende o competenze...',
      searchButton: 'Cerca Lavori',
      hero: {
        title: 'Trova il lavoro dei tuoi sogni 10x più velocemente con l\'IA',
        subtitle: 'SmartJobFit utilizza l\'IA avanzata per abbinarti con opportunità di lavoro perfette, ottimizzare il tuo CV e prepararti per i colloqui.',
        cta: 'Inizia gratis',
        freeTrial: 'Inizia prova gratuita'
      },
      stats: {
        jobs: '1M+ Lavori',
        users: '50K+ Utenti',
        interviews: '5x più colloqui',
        matches: '1M+ Corrispondenze di lavoro trovate'
      },
      features: {
        title: 'Funzionalità potenti guidate dall\'IA',
        subtitle: 'Tutto ciò di cui hai bisogno per ottenere il lavoro dei tuoi sogni',
        aiSearch: {
          title: 'Ricerca lavoro IA',
          description: 'Cerca su 15+ siti di lavoro con abbinamento IA e ricevi raccomandazioni personalizzate.',
          features: ['Abbinamento lavoro intelligente', 'Raccomandazioni personalizzate', 'Avvisi in tempo reale']
        },
        resumeOptimization: {
          title: 'Ottimizzazione CV',
          description: 'Analisi CV e ottimizzazione ATS guidate dall\'IA per aumentare il tuo tasso di risposta.',
          features: ['Ottimizzazione ATS', 'Analisi parole chiave', 'Suggerimenti specifici del settore']
        },
        interviewPrep: {
          title: 'Preparazione colloquio',
          description: 'Coach IA per colloqui simulati e feedback personalizzato per eccellere nei tuoi colloqui.',
          features: ['Colloqui simulati', 'Feedback in tempo reale', 'Domande del settore']
        },
        analytics: {
          title: 'Analisi avanzate',
          description: 'Traccia i tuoi progressi e ottimizza la tua strategia con insights dettagliati.'
        }
      },
      interviewFeatures: {
        title: 'Padroneggia i tuoi colloqui',
        mockInterviews: {
          title: 'Colloqui simulati IA',
          description: 'Esercitati con il nostro intervistatore IA che si adatta al tuo settore e ruolo. Ottieni esperienza di colloquio realistica.',
          features: ['Domande specifiche del settore', 'Feedback in tempo reale', 'Analisi voce e linguaggio del corpo']
        },
        questionBank: {
          title: 'Banca domande',
          description: 'Accedi a 1000+ domande di colloquio adattate al tuo ruolo, con risposte esperte e spiegazioni.',
          features: ['Domande comportamentali', 'Sfide tecniche', 'Preparazione specifica dell\'azienda']
        },
        salaryNegotiation: {
          title: 'Negoziazione stipendio',
          description: 'Impara a negoziare come un professionista con coaching IA e insights di dati di mercato.',
          features: ['Dati stipendio di mercato', 'Strategie di negoziazione', 'Scenari di pratica']
        }
      },
      testimonials: {
        title: 'Fidato da cercatori di lavoro in tutto il mondo',
        subtitle: 'Unisciti a migliaia di persone che hanno trovato il loro lavoro dei sogni con SmartJobFit',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Product Manager presso TechCorp',
            content: 'SmartJobFit mi ha aiutato a ottenere il lavoro dei miei sogni in sole 3 settimane! L\'ottimizzazione CV IA ha aumentato il mio tasso di risposta del 300%.'
          },
          {
            name: 'Michael Chen',
            role: 'Software Engineer presso StartupCo',
            content: 'L\'IA di preparazione colloqui era incredibile. Mi sentivo sicuro andando ai miei colloqui e li ho superati tutti. Altamente raccomandato!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'UX Designer presso DesignStudio',
            content: 'Piattaforma fantastica! Il coaching di negoziazione stipendio mi ha aiutato a ottenere il 25% in più della mia offerta iniziale. Vale ogni centesimo!'
          }
        ]
      },
      pricing: {
        title: 'Scegli il tuo piano',
        subtitle: 'Inizia gratis, aggiorna quando sei pronto ad accelerare la tua carriera',
        monthly: 'Mensile',
        yearly: 'Annuale',
        mostPopular: 'Più popolare',
        free: {
          title: 'Gratuito',
          price: '0€',
          description: 'Perfetto per iniziare',
          features: ['5 ricerche lavoro IA al mese', 'Ottimizzazione CV base', 'Accesso limitato ai siti di lavoro', 'Supporto email'],
          buttonText: 'Inizia gratis'
        },
        professional: {
          title: 'Professionale',
          price: '29€',
          description: 'Per cercatori di lavoro seri',
          features: ['Ricerche lavoro IA illimitate', 'Ottimizzazione CV avanzata', 'Accesso a tutti i 15+ siti di lavoro', 'Preparazione colloquio IA', 'Supporto prioritario', 'Dashboard analitico'],
          buttonText: 'Aggiorna a Professionale'
        },
        enterprise: {
          title: 'Coach Carriera IA',
          price: '79€',
          description: 'Per professionisti della carriera',
          features: ['Tutto in Professionale', 'Analisi avanzate', 'Coaching negoziazione stipendio IA', 'Coaching agente carriera IA 24/7', 'Pianificazione strategica IA', 'Integrazioni IA personalizzate'],
          buttonText: 'Aggiorna a Coach Carriera IA'
        }
      },
      faq: {
        title: 'Domande frequenti',
        questions: [
          {
            question: 'Come funziona l\'abbinamento lavoro IA di SmartJobFit?',
            answer: 'La nostra IA analizza le tue competenze, esperienza e preferenze per abbinarti con le opportunità di lavoro più rilevanti da 15+ siti di lavoro. Impara dalle tue interazioni per migliorare le raccomandazioni nel tempo.'
          },
          {
            question: 'Posso cancellare il mio abbonamento in qualsiasi momento?',
            answer: 'Sì, puoi cancellare il tuo abbonamento in qualsiasi momento. Non ci sono contratti a lungo termine o tasse di cancellazione. Il tuo abbonamento rimarrà attivo fino alla fine del tuo periodo di fatturazione.'
          },
          {
            question: 'Come funziona l\'ottimizzazione CV?',
            answer: 'La nostra IA analizza il tuo CV contro gli standard del settore e le descrizioni di lavoro, fornendo raccomandazioni specifiche per parole chiave, formattazione e contenuto per migliorare il tuo punteggio ATS e tasso di risposta.'
          },
          {
            question: 'I miei dati sono sicuri?',
            answer: 'Assolutamente. Utilizziamo misure di sicurezza di livello aziendale per proteggere le tue informazioni personali. I tuoi dati sono criptati e mai condivisi con terze parti senza il tuo consenso esplicito.'
          },
          {
            question: 'Offrite una garanzia di rimborso?',
            answer: 'Sì, offriamo una garanzia di rimborso di 30 giorni su tutti i piani a pagamento. Se non sei soddisfatto, contatta il nostro team di supporto per un rimborso completo.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Bentornato',
      quickActions: 'Azioni rapide',
      recentActivity: 'Attività recente',
      analytics: 'Analisi',
      jobSearches: 'Ricerche di lavoro',
      applications: 'Candidature',
      interviews: 'Colloqui',
      resumeScore: 'Punteggio CV',
      profileStrength: 'Forza del profilo',
      matchingJobs: 'Lavori corrispondenti',
      cvAnalysis: 'Analisi CV',
      interviewPrep: 'Preparazione colloquio',
      jobMatching: 'Abbinamento lavoro',
      upgrade: 'Aggiorna piano',
      findJobs: 'Trova lavori',
      optimizeResume: 'Ottimizza CV',
      practiceInterview: 'Pratica colloquio',
      viewAnalytics: 'Visualizza analisi',
      applicationStats: 'Statistiche candidature',
      successRate: 'Tasso di successo',
      responseRate: 'Tasso di risposta',
      interviewsScheduled: 'Colloqui programmati'
    },
    common: {
      getStarted: 'Inizia',
      learnMore: 'Scopri di più',
      upgrade: 'Aggiorna',
      cancel: 'Annulla',
      save: 'Salva',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      search: 'Cerca',
      filter: 'Filtra',
      apply: 'Applica',
      view: 'Visualizza',
      edit: 'Modifica',
      delete: 'Elimina',
      back: 'Indietro',
      next: 'Avanti',
      previous: 'Precedente',
      close: 'Chiudi',
      submit: 'Invia',
      tryFree: 'Prova gratis',
      contactSales: 'Contatta vendite',
      signUp: 'Registrati',
      signIn: 'Accedi'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'Il futuro della ricerca di lavoro è qui. Trova il lavoro dei tuoi sogni 10x più velocemente con abbinamento e ottimizzazione IA.',
      features: 'Funzionalità',
      aiJobSearch: 'Ricerca lavoro IA',
      resumeOptimization: 'Ottimizzazione CV',
      interviewPreparation: 'Preparazione colloquio',
      pricing: 'Prezzi',
      support: 'Supporto',
      helpCenter: 'Centro aiuto',
      copyright: '© 2024 SmartJobFit. Tutti i diritti riservati.'
    },
    help: {
      title: 'Centro aiuto',
      subtitle: 'Trova risposte alle tue domande e impara come ottenere il massimo da SmartJobFit',
      searchPlaceholder: 'Cerca aiuto...',
      categories: {
        gettingStarted: 'Iniziare',
        accountManagement: 'Gestione account',
        billing: 'Fatturazione e abbonamento',
        troubleshooting: 'Risoluzione problemi'
      },
      articles: [
        {
          title: 'Iniziare con SmartJobFit',
          description: 'Impara come creare il tuo account e iniziare il tuo percorso di ricerca lavoro'
        },
        {
          title: 'Ottimizzare il tuo CV',
          description: 'Migliori pratiche per creare un CV compatibile con ATS'
        },
        {
          title: 'Utilizzare la ricerca lavoro IA',
          description: 'Come sfruttare il nostro sistema di abbinamento lavoro IA'
        },
        {
          title: 'Guida preparazione colloquio',
          description: 'Preparati al successo con il nostro coach colloquio IA'
        }
      ]
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      pricing: 'Precios',
      features: 'Características',
      help: 'Ayuda',
      login: 'Iniciar sesión',
      dashboard: 'Panel',
      logout: 'Cerrar sesión'
    },
    landing: {
      heroTitle: 'Encuentra el trabajo de tus sueños 10x más rápido con IA',
      heroDescription: 'Busca 1M+ empleos de 15+ fuentes. CVs optimizados por IA. Coincidencias inteligentes. Aplicaciones con un clic. El futuro de la búsqueda de empleo está aquí.',
      searchPlaceholder: 'Buscar empleos, empresas o habilidades...',
      searchButton: 'Buscar Empleos',
      hero: {
        title: 'Encuentra el trabajo de tus sueños 10x más rápido con IA',
        subtitle: 'SmartJobFit utiliza IA avanzada para emparejarte con oportunidades de trabajo perfectas, optimizar tu CV y prepararte para entrevistas.',
        cta: 'Comenzar gratis',
        freeTrial: 'Comenzar prueba gratuita'
      },
      stats: {
        jobs: '1M+ Empleos',
        users: '50K+ Usuarios',
        interviews: '5x más entrevistas',
        matches: '1M+ Coincidencias de trabajo encontradas'
      },
      features: {
        title: 'Características poderosas impulsadas por IA',
        subtitle: 'Todo lo que necesitas para conseguir el trabajo de tus sueños',
        aiSearch: {
          title: 'Búsqueda de empleo IA',
          description: 'Busca en 15+ sitios de empleo con emparejamiento IA y recibe recomendaciones personalizadas.',
          features: ['Emparejamiento inteligente de empleos', 'Recomendaciones personalizadas', 'Alertas en tiempo real']
        },
        resumeOptimization: {
          title: 'Optimización de CV',
          description: 'Análisis de CV y optimización ATS impulsados por IA para aumentar tu tasa de respuesta.',
          features: ['Optimización ATS', 'Análisis de palabras clave', 'Consejos específicos de la industria']
        },
        interviewPrep: {
          title: 'Preparación de entrevistas',
          description: 'Coach IA para entrevistas simuladas y comentarios personalizados para destacar en tus entrevistas.',
          features: ['Entrevistas simuladas', 'Comentarios en tiempo real', 'Preguntas de la industria']
        },
        analytics: {
          title: 'Análisis avanzados',
          description: 'Rastrea tu progreso y optimiza tu estrategia con insights detallados.'
        }
      },
      interviewFeatures: {
        title: 'Domina tus entrevistas',
        mockInterviews: {
          title: 'Entrevistas simuladas IA',
          description: 'Practica con nuestro entrevistador IA que se adapta a tu industria y rol. Obtén experiencia de entrevista realista.',
          features: ['Preguntas específicas de la industria', 'Comentarios en tiempo real', 'Análisis de voz y lenguaje corporal']
        },
        questionBank: {
          title: 'Banco de preguntas',
          description: 'Accede a 1000+ preguntas de entrevista adaptadas a tu rol, con respuestas expertas y explicaciones.',
          features: ['Preguntas de comportamiento', 'Desafíos técnicos', 'Preparación específica de la empresa']
        },
        salaryNegotiation: {
          title: 'Negociación salarial',
          description: 'Aprende a negociar como un profesional con coaching IA e insights de datos de mercado.',
          features: ['Datos salariales del mercado', 'Estrategias de negociación', 'Escenarios de práctica']
        }
      },
      testimonials: {
        title: 'Confiado por buscadores de empleo en todo el mundo',
        subtitle: 'Únete a miles que encontraron el trabajo de sus sueños con SmartJobFit',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Gerente de Producto en TechCorp',
            content: '¡SmartJobFit me ayudó a conseguir el trabajo de mis sueños en solo 3 semanas! La optimización de CV por IA aumentó mi tasa de respuesta un 300%.'
          },
          {
            name: 'Michael Chen',
            role: 'Ingeniero de Software en StartupCo',
            content: 'La IA de preparación de entrevistas fue increíble. Me sentí seguro yendo a mis entrevistas y las dominé todas. ¡Altamente recomendado!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Diseñadora UX en DesignStudio',
            content: '¡Plataforma increíble! El coaching de negociación salarial me ayudó a obtener 25% más que mi oferta inicial. ¡Vale cada centavo!'
          }
        ]
      },
      pricing: {
        title: 'Elige tu plan',
        subtitle: 'Comienza gratis, actualiza cuando estés listo para acelerar tu carrera',
        monthly: 'Mensual',
        yearly: 'Anual',
        mostPopular: 'Más popular',
        free: {
          title: 'Gratis',
          price: '0€',
          description: 'Perfecto para comenzar',
          features: ['5 búsquedas de empleo IA al mes', 'Optimización de CV básica', 'Acceso limitado a sitios de empleo', 'Soporte por email'],
          buttonText: 'Comenzar gratis'
        },
        professional: {
          title: 'Profesional',
          price: '29€',
          description: 'Para buscadores de empleo serios',
          features: ['Búsquedas de empleo IA ilimitadas', 'Optimización de CV avanzada', 'Acceso a todos los 15+ sitios de empleo', 'Preparación de entrevistas IA', 'Soporte prioritario', 'Panel de análisis'],
          buttonText: 'Actualizar a Profesional'
        },
        enterprise: {
          title: 'Coach de Carrera IA',
          price: '79€',
          description: 'Para profesionales de carrera',
          features: ['Todo en Profesional', 'Análisis avanzados', 'Coaching de negociación salarial IA', 'Coaching de agente de carrera IA 24/7', 'Planificación estratégica IA', 'Integraciones IA personalizadas'],
          buttonText: 'Actualizar a Coach de Carrera IA'
        }
      },
      faq: {
        title: 'Preguntas frecuentes',
        questions: [
          {
            question: '¿Cómo funciona el emparejamiento de empleos IA de SmartJobFit?',
            answer: 'Nuestra IA analiza tus habilidades, experiencia y preferencias para emparejarte con las oportunidades de trabajo más relevantes de 15+ sitios de empleo. Aprende de tus interacciones para mejorar las recomendaciones con el tiempo.'
          },
          {
            question: '¿Puedo cancelar mi suscripción en cualquier momento?',
            answer: 'Sí, puedes cancelar tu suscripción en cualquier momento. No hay contratos a largo plazo ni tarifas de cancelación. Tu suscripción permanecerá activa hasta el final de tu período de facturación.'
          },
          {
            question: '¿Cómo funciona la optimización de CV?',
            answer: 'Nuestra IA analiza tu CV contra estándares de la industria y descripciones de trabajo, proporcionando recomendaciones específicas para palabras clave, formato y contenido para mejorar tu puntuación ATS y tasa de respuesta.'
          },
          {
            question: '¿Están mis datos seguros?',
            answer: 'Absolutamente. Utilizamos medidas de seguridad de nivel empresarial para proteger tu información personal. Tus datos están encriptados y nunca se comparten con terceros sin tu consentimiento explícito.'
          },
          {
            question: '¿Ofrecen garantía de devolución de dinero?',
            answer: 'Sí, ofrecemos una garantía de devolución de dinero de 30 días en todos los planes de pago. Si no estás satisfecho, contacta a nuestro equipo de soporte para un reembolso completo.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Bienvenido de vuelta',
      quickActions: 'Acciones rápidas',
      recentActivity: 'Actividad reciente',
      analytics: 'Análisis',
      jobSearches: 'Búsquedas de empleo',
      applications: 'Aplicaciones',
      interviews: 'Entrevistas',
      resumeScore: 'Puntuación de CV',
      profileStrength: 'Fuerza del perfil',
      matchingJobs: 'Empleos coincidentes',
      cvAnalysis: 'Análisis de CV',
      interviewPrep: 'Preparación de entrevistas',
      jobMatching: 'Emparejamiento de empleos',
      upgrade: 'Actualizar plan',
      findJobs: 'Encontrar empleos',
      optimizeResume: 'Optimizar CV',
      practiceInterview: 'Practicar entrevista',
      viewAnalytics: 'Ver análisis',
      applicationStats: 'Estadísticas de aplicaciones',
      successRate: 'Tasa de éxito',
      responseRate: 'Tasa de respuesta',
      interviewsScheduled: 'Entrevistas programadas'
    },
    common: {
      getStarted: 'Comenzar',
      learnMore: 'Aprender más',
      upgrade: 'Actualizar',
      cancel: 'Cancelar',
      save: 'Guardar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      search: 'Buscar',
      filter: 'Filtrar',
      apply: 'Aplicar',
      view: 'Ver',
      edit: 'Editar',
      delete: 'Eliminar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      submit: 'Enviar',
      tryFree: 'Probar gratis',
      contactSales: 'Contactar ventas',
      signUp: 'Registrarse',
      signIn: 'Iniciar sesión'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'El futuro de la búsqueda de empleo está aquí. Encuentra el trabajo de tus sueños 10x más rápido con emparejamiento y optimización IA.',
      features: 'Características',
      aiJobSearch: 'Búsqueda de empleo IA',
      resumeOptimization: 'Optimización de CV',
      interviewPreparation: 'Preparación de entrevistas',
      pricing: 'Precios',
      support: 'Soporte',
      helpCenter: 'Centro de ayuda',
      copyright: '© 2024 SmartJobFit. Todos los derechos reservados.'
    },
    help: {
      title: 'Centro de ayuda',
      subtitle: 'Encuentra respuestas a tus preguntas y aprende cómo obtener el máximo de SmartJobFit',
      searchPlaceholder: 'Buscar ayuda...',
      categories: {
        gettingStarted: 'Comenzar',
        accountManagement: 'Gestión de cuenta',
        billing: 'Facturación y suscripción',
        troubleshooting: 'Solución de problemas'
      },
      articles: [
        {
          title: 'Comenzar con SmartJobFit',
          description: 'Aprende cómo crear tu cuenta y comenzar tu viaje de búsqueda de empleo'
        },
        {
          title: 'Optimizar tu CV',
          description: 'Mejores prácticas para crear un CV compatible con ATS'
        },
        {
          title: 'Usar la búsqueda de empleo IA',
          description: 'Cómo aprovechar nuestro sistema de emparejamiento de empleos IA'
        },
        {
          title: 'Guía de preparación de entrevistas',
          description: 'Prepárate para el éxito con nuestro coach de entrevistas IA'
        }
      ]
    }
  },
  pt: {
    nav: {
      home: 'Início',
      pricing: 'Preços',
      features: 'Recursos',
      help: 'Ajuda',
      login: 'Entrar',
      dashboard: 'Painel',
      logout: 'Sair'
    },
    landing: {
      heroTitle: 'Encontre o emprego dos seus sonhos 10x mais rápido com IA',
      heroDescription: 'Pesquise 1M+ empregos de 15+ fontes. CVs otimizados por IA. Correspondência inteligente. Candidaturas com um clique. O futuro da busca de emprego está aqui.',
      searchPlaceholder: 'Pesquisar empregos, empresas ou habilidades...',
      searchButton: 'Pesquisar Empregos',
      hero: {
        title: 'Encontre o emprego dos seus sonhos 10x mais rápido com IA',
        subtitle: 'SmartJobFit usa IA avançada para combiná-lo com oportunidades de trabalho perfeitas, otimizar seu CV e prepará-lo para entrevistas.',
        cta: 'Começar grátis',
        freeTrial: 'Começar teste gratuito'
      },
      stats: {
        jobs: '1M+ Empregos',
        users: '50K+ Usuários',
        interviews: '5x mais entrevistas',
        matches: '1M+ Correspondências de emprego encontradas'
      },
      features: {
        title: 'Recursos poderosos impulsionados por IA',
        subtitle: 'Tudo que você precisa para conseguir o emprego dos seus sonhos',
        aiSearch: {
          title: 'Busca de emprego IA',
          description: 'Pesquise em 15+ sites de emprego com correspondência IA e receba recomendações personalizadas.',
          features: ['Correspondência inteligente de empregos', 'Recomendações personalizadas', 'Alertas em tempo real']
        },
        resumeOptimization: {
          title: 'Otimização de CV',
          description: 'Análise de CV e otimização ATS impulsionados por IA para aumentar sua taxa de resposta.',
          features: ['Otimização ATS', 'Análise de palavras-chave', 'Dicas específicas da indústria']
        },
        interviewPrep: {
          title: 'Preparação para entrevistas',
          description: 'Coach IA para entrevistas simuladas e feedback personalizado para se destacar nas suas entrevistas.',
          features: ['Entrevistas simuladas', 'Feedback em tempo real', 'Perguntas da indústria']
        },
        analytics: {
          title: 'Análises avançadas',
          description: 'Acompanhe seu progresso e otimize sua estratégia com insights detalhados.'
        }
      },
      interviewFeatures: {
        title: 'Domine suas entrevistas',
        mockInterviews: {
          title: 'Entrevistas simuladas IA',
          description: 'Pratique com nosso entrevistador IA que se adapta à sua indústria e função. Obtenha experiência de entrevista realista.',
          features: ['Perguntas específicas da indústria', 'Feedback em tempo real', 'Análise de voz e linguagem corporal']
        },
        questionBank: {
          title: 'Banco de perguntas',
          description: 'Acesse 1000+ perguntas de entrevista adaptadas à sua função, com respostas especializadas e explicações.',
          features: ['Perguntas comportamentais', 'Desafios técnicos', 'Preparação específica da empresa']
        },
        salaryNegotiation: {
          title: 'Negociação salarial',
          description: 'Aprenda a negociar como um profissional com coaching IA e insights de dados de mercado.',
          features: ['Dados salariais do mercado', 'Estratégias de negociação', 'Cenários de prática']
        }
      },
      testimonials: {
        title: 'Confiado por buscadores de emprego em todo o mundo',
        subtitle: 'Junte-se a milhares que encontraram o emprego dos seus sonhos com SmartJobFit',
        reviews: [
          {
            name: 'Sarah Johnson',
            role: 'Gerente de Produto na TechCorp',
            content: 'SmartJobFit me ajudou a conseguir o emprego dos meus sonhos em apenas 3 semanas! A otimização de CV por IA aumentou minha taxa de resposta em 300%.'
          },
          {
            name: 'Michael Chen',
            role: 'Engenheiro de Software na StartupCo',
            content: 'A IA de preparação para entrevistas foi incrível. Me senti confiante indo para minhas entrevistas e dominei todas. Altamente recomendado!'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Designer UX na DesignStudio',
            content: 'Plataforma incrível! O coaching de negociação salarial me ajudou a conseguir 25% a mais que minha oferta inicial. Vale cada centavo!'
          }
        ]
      },
      pricing: {
        title: 'Escolha seu plano',
        subtitle: 'Comece grátis, atualize quando estiver pronto para acelerar sua carreira',
        monthly: 'Mensal',
        yearly: 'Anual',
        mostPopular: 'Mais popular',
        free: {
          title: 'Gratuito',
          price: 'R$0',
          description: 'Perfeito para começar',
          features: ['5 buscas de emprego IA por mês', 'Otimização de CV básica', 'Acesso limitado a sites de emprego', 'Suporte por email'],
          buttonText: 'Começar grátis'
        },
        professional: {
          title: 'Profissional',
          price: 'R$149',
          description: 'Para buscadores de emprego sérios',
          features: ['Buscas de emprego IA ilimitadas', 'Otimização de CV avançada', 'Acesso a todos os 15+ sites de emprego', 'Preparação para entrevistas IA', 'Suporte prioritário', 'Painel de análises'],
          buttonText: 'Atualizar para Profissional'
        },
        enterprise: {
          title: 'Coach de Carreira IA',
          price: 'R$399',
          description: 'Para profissionais de carreira',
          features: ['Tudo no Profissional', 'Análises avançadas', 'Coaching de negociação salarial IA', 'Coaching de agente de carreira IA 24/7', 'Planejamento estratégico IA', 'Integrações IA personalizadas'],
          buttonText: 'Atualizar para Coach de Carreira IA'
        }
      },
      faq: {
        title: 'Perguntas frequentes',
        questions: [
          {
            question: 'Como funciona a correspondência de empregos IA do SmartJobFit?',
            answer: 'Nossa IA analisa suas habilidades, experiência e preferências para combiná-lo com as oportunidades de trabalho mais relevantes de 15+ sites de emprego. Ela aprende com suas interações para melhorar as recomendações ao longo do tempo.'
          },
          {
            question: 'Posso cancelar minha assinatura a qualquer momento?',
            answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo ou taxas de cancelamento. Sua assinatura permanecerá ativa até o final do seu período de faturamento.'
          },
          {
            question: 'Como funciona a otimização de CV?',
            answer: 'Nossa IA analisa seu CV contra padrões da indústria e descrições de trabalho, fornecendo recomendações específicas para palavras-chave, formatação e conteúdo para melhorar sua pontuação ATS e taxa de resposta.'
          },
          {
            question: 'Meus dados estão seguros?',
            answer: 'Absolutamente. Usamos medidas de segurança de nível empresarial para proteger suas informações pessoais. Seus dados são criptografados e nunca compartilhados com terceiros sem seu consentimento explícito.'
          },
          {
            question: 'Vocês oferecem garantia de devolução do dinheiro?',
            answer: 'Sim, oferecemos uma garantia de devolução do dinheiro de 30 dias em todos os planos pagos. Se você não estiver satisfeito, entre em contato com nossa equipe de suporte para um reembolso completo.'
          }
        ]
      }
    },
    dashboard: {
      welcome: 'Bem-vindo de volta',
      quickActions: 'Ações rápidas',
      recentActivity: 'Atividade recente',
      analytics: 'Análises',
      jobSearches: 'Buscas de emprego',
      applications: 'Candidaturas',
      interviews: 'Entrevistas',
      resumeScore: 'Pontuação do CV',
      profileStrength: 'Força do perfil',
      matchingJobs: 'Empregos correspondentes',
      cvAnalysis: 'Análise do CV',
      interviewPrep: 'Preparação para entrevistas',
      jobMatching: 'Correspondência de empregos',
      upgrade: 'Atualizar plano',
      findJobs: 'Encontrar empregos',
      optimizeResume: 'Otimizar CV',
      practiceInterview: 'Praticar entrevista',
      viewAnalytics: 'Ver análises',
      applicationStats: 'Estatísticas de candidaturas',
      successRate: 'Taxa de sucesso',
      responseRate: 'Taxa de resposta',
      interviewsScheduled: 'Entrevistas agendadas'
    },
    common: {
      getStarted: 'Começar',
      learnMore: 'Saber mais',
      upgrade: 'Atualizar',
      cancel: 'Cancelar',
      save: 'Salvar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      search: 'Pesquisar',
      filter: 'Filtrar',
      apply: 'Aplicar',
      view: 'Ver',
      edit: 'Editar',
      delete: 'Excluir',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      close: 'Fechar',
      submit: 'Enviar',
      tryFree: 'Experimentar grátis',
      contactSales: 'Contatar vendas',
      signUp: 'Cadastrar-se',
      signIn: 'Entrar'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'O futuro da busca de emprego está aqui. Encontre o emprego dos seus sonhos 10x mais rápido com correspondência e otimização IA.',
      features: 'Recursos',
      aiJobSearch: 'Busca de emprego IA',
      resumeOptimization: 'Otimização de CV',
      interviewPreparation: 'Preparação para entrevistas',
      pricing: 'Preços',
      support: 'Suporte',
      helpCenter: 'Central de ajuda',
      copyright: '© 2024 SmartJobFit. Todos os direitos reservados.'
    },
    help: {
      title: 'Central de ajuda',
      subtitle: 'Encontre respostas para suas perguntas e aprenda como obter o máximo do SmartJobFit',
      searchPlaceholder: 'Pesquisar ajuda...',
      categories: {
        gettingStarted: 'Começando',
        accountManagement: 'Gerenciamento de conta',
        billing: 'Faturamento e assinatura',
        troubleshooting: 'Solução de problemas'
      },
      articles: [
        {
          title: 'Começando com SmartJobFit',
          description: 'Aprenda como criar sua conta e começar sua jornada de busca de emprego'
        },
        {
          title: 'Otimizando seu CV',
          description: 'Melhores práticas para criar um CV compatível com ATS'
        },
        {
          title: 'Usando a busca de emprego IA',
          description: 'Como aproveitar nosso sistema de correspondência de empregos IA'
        },
        {
          title: 'Guia de preparação para entrevistas',
          description: 'Prepare-se para o sucesso com nosso coach de entrevistas IA'
        }
      ]
    }
  }
};

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en
});

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export { translations };