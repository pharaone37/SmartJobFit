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
      hero: {
        title: 'Find Your Dream Job 10x Faster with AI',
        subtitle: 'SmartJobFit uses advanced AI to match you with perfect job opportunities, optimize your resume, and prepare you for interviews.',
        cta: 'Get Started Free',
        freeTrial: 'Start Free Trial'
      },
      features: {
        title: 'Powerful AI-Driven Features',
        subtitle: 'Everything you need to land your dream job',
        aiSearch: {
          title: 'AI Job Search',
          description: 'Search across 15+ job boards with AI-powered matching'
        },
        resumeOptimization: {
          title: 'Resume Optimization',
          description: 'AI-powered resume analysis and ATS optimization'
        },
        interviewPrep: {
          title: 'Interview Preparation',
          description: 'AI coach for mock interviews and feedback'
        },
        analytics: {
          title: 'Advanced Analytics',
          description: 'Track your progress and optimize your strategy'
        }
      },
      pricing: {
        title: 'Choose Your Plan',
        subtitle: 'Start free, upgrade when you\'re ready',
        monthly: 'Monthly',
        yearly: 'Yearly',
        free: {
          title: 'Free',
          price: '$0',
          description: 'Perfect for getting started',
          features: ['5 AI job searches per month', 'Basic resume optimization', 'Limited job board access', 'Email support']
        },
        professional: {
          title: 'Professional',
          price: '$29',
          description: 'For serious job seekers',
          features: ['Unlimited AI job searches', 'Advanced resume optimization', 'All 15+ job board access', 'AI interview preparation', 'Priority support', 'Analytics dashboard']
        },
        enterprise: {
          title: 'AI Career Coach',
          price: '$79',
          description: 'For career professionals',
          features: ['Everything in Professional', 'Advanced analytics', 'Salary negotiation AI', 'AI Agent coaching', 'Priority processing', 'Custom integrations']
        }
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
      upgrade: 'Upgrade Plan'
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
      submit: 'Submit'
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
      hero: {
        title: 'Finden Sie Ihren Traumjob 10x schneller mit KI',
        subtitle: 'SmartJobFit nutzt fortschrittliche KI, um Sie mit perfekten Stellenangeboten zu verbinden, Ihren Lebenslauf zu optimieren und Sie auf Vorstellungsgespräche vorzubereiten.',
        cta: 'Kostenlos starten',
        freeTrial: 'Kostenlose Testversion starten'
      },
      features: {
        title: 'Leistungsstarke KI-gesteuerte Funktionen',
        subtitle: 'Alles, was Sie brauchen, um Ihren Traumjob zu bekommen',
        aiSearch: {
          title: 'KI-Jobsuche',
          description: 'Suchen Sie auf 15+ Jobbörsen mit KI-gesteuertem Matching'
        },
        resumeOptimization: {
          title: 'Lebenslauf-Optimierung',
          description: 'KI-gesteuerte Lebenslauf-Analyse und ATS-Optimierung'
        },
        interviewPrep: {
          title: 'Vorstellungsgespräch-Vorbereitung',
          description: 'KI-Coach für Probegespräche und Feedback'
        },
        analytics: {
          title: 'Erweiterte Analysen',
          description: 'Verfolgen Sie Ihren Fortschritt und optimieren Sie Ihre Strategie'
        }
      },
      pricing: {
        title: 'Wählen Sie Ihren Plan',
        subtitle: 'Kostenlos starten, upgraden wenn Sie bereit sind',
        monthly: 'Monatlich',
        yearly: 'Jährlich',
        free: {
          title: 'Kostenlos',
          price: '0€',
          description: 'Perfekt für den Einstieg',
          features: ['5 KI-Jobsuchen pro Monat', 'Grundlegende Lebenslauf-Optimierung', 'Begrenzter Jobbörsen-Zugang', 'E-Mail-Support']
        },
        professional: {
          title: 'Professional',
          price: '29€',
          description: 'Für ernsthafte Jobsuchende',
          features: ['Unbegrenzte KI-Jobsuchen', 'Erweiterte Lebenslauf-Optimierung', 'Alle 15+ Jobbörsen-Zugang', 'KI-Vorstellungsgespräch-Vorbereitung', 'Prioritäts-Support', 'Analytics-Dashboard']
        },
        enterprise: {
          title: 'KI-Karriere-Coach',
          price: '79€',
          description: 'Für Karriere-Profis',
          features: ['Alles in Professional', 'Erweiterte Analysen', 'Gehaltsverhandlungs-KI', 'KI-Agent-Coaching', 'Prioritäts-Verarbeitung', 'Benutzerdefinierte Integrationen']
        }
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
      upgrade: 'Plan upgraden'
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
      submit: 'Absenden'
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
    }
  },
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
      hero: {
        title: 'Trouvez votre emploi de rêve 10x plus rapidement avec l\'IA',
        subtitle: 'SmartJobFit utilise l\'IA avancée pour vous connecter avec des opportunités d\'emploi parfaites, optimiser votre CV et vous préparer aux entretiens.',
        cta: 'Commencer gratuitement',
        freeTrial: 'Commencer l\'essai gratuit'
      },
      features: {
        title: 'Fonctionnalités puissantes pilotées par l\'IA',
        subtitle: 'Tout ce dont vous avez besoin pour décrocher votre emploi de rêve',
        aiSearch: {
          title: 'Recherche d\'emploi IA',
          description: 'Recherchez sur 15+ sites d\'emploi avec correspondance IA'
        },
        resumeOptimization: {
          title: 'Optimisation de CV',
          description: 'Analyse de CV et optimisation ATS pilotées par l\'IA'
        },
        interviewPrep: {
          title: 'Préparation d\'entretien',
          description: 'Coach IA pour entretiens simulés et commentaires'
        },
        analytics: {
          title: 'Analyses avancées',
          description: 'Suivez vos progrès et optimisez votre stratégie'
        }
      },
      pricing: {
        title: 'Choisissez votre plan',
        subtitle: 'Commencez gratuitement, mettez à niveau quand vous êtes prêt',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        free: {
          title: 'Gratuit',
          price: '0€',
          description: 'Parfait pour commencer',
          features: ['5 recherches d\'emploi IA par mois', 'Optimisation de CV de base', 'Accès limité aux sites d\'emploi', 'Support par e-mail']
        },
        professional: {
          title: 'Professionnel',
          price: '29€',
          description: 'Pour les chercheurs d\'emploi sérieux',
          features: ['Recherches d\'emploi IA illimitées', 'Optimisation de CV avancée', 'Accès à tous les 15+ sites d\'emploi', 'Préparation d\'entretien IA', 'Support prioritaire', 'Tableau de bord analytique']
        },
        enterprise: {
          title: 'Coach Carrière IA',
          price: '79€',
          description: 'Pour les professionnels de carrière',
          features: ['Tout dans Professionnel', 'Analyses avancées', 'IA de négociation salariale', 'Coaching d\'agent IA', 'Traitement prioritaire', 'Intégrations personnalisées']
        }
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
      upgrade: 'Mettre à niveau le plan'
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
      submit: 'Soumettre'
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
    }
  },
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
      hero: {
        title: 'Trova il lavoro dei tuoi sogni 10x più velocemente con l\'IA',
        subtitle: 'SmartJobFit utilizza l\'IA avanzata per abbinarti con opportunità di lavoro perfette, ottimizzare il tuo CV e prepararti per i colloqui.',
        cta: 'Inizia gratis',
        freeTrial: 'Inizia prova gratuita'
      },
      features: {
        title: 'Funzionalità potenti guidate dall\'IA',
        subtitle: 'Tutto ciò di cui hai bisogno per ottenere il lavoro dei tuoi sogni',
        aiSearch: {
          title: 'Ricerca lavoro IA',
          description: 'Cerca su 15+ siti di lavoro con abbinamento IA'
        },
        resumeOptimization: {
          title: 'Ottimizzazione CV',
          description: 'Analisi CV e ottimizzazione ATS guidate dall\'IA'
        },
        interviewPrep: {
          title: 'Preparazione colloquio',
          description: 'Coach IA per colloqui simulati e feedback'
        },
        analytics: {
          title: 'Analisi avanzate',
          description: 'Traccia i tuoi progressi e ottimizza la tua strategia'
        }
      },
      pricing: {
        title: 'Scegli il tuo piano',
        subtitle: 'Inizia gratis, aggiorna quando sei pronto',
        monthly: 'Mensile',
        yearly: 'Annuale',
        free: {
          title: 'Gratuito',
          price: '0€',
          description: 'Perfetto per iniziare',
          features: ['5 ricerche lavoro IA al mese', 'Ottimizzazione CV base', 'Accesso limitato ai siti di lavoro', 'Supporto email']
        },
        professional: {
          title: 'Professionale',
          price: '29€',
          description: 'Per chi cerca lavoro seriamente',
          features: ['Ricerche lavoro IA illimitate', 'Ottimizzazione CV avanzata', 'Accesso a tutti i 15+ siti di lavoro', 'Preparazione colloquio IA', 'Supporto prioritario', 'Dashboard analisi']
        },
        enterprise: {
          title: 'Coach Carriera IA',
          price: '79€',
          description: 'Per professionisti della carriera',
          features: ['Tutto in Professionale', 'Analisi avanzate', 'IA negoziazione salario', 'Coaching agente IA', 'Elaborazione prioritaria', 'Integrazioni personalizzate']
        }
      }
    },
    dashboard: {
      welcome: 'Bentornato',
      quickActions: 'Azioni rapide',
      recentActivity: 'Attività recente',
      analytics: 'Analisi',
      jobSearches: 'Ricerche lavoro',
      applications: 'Candidature',
      interviews: 'Colloqui',
      resumeScore: 'Punteggio CV',
      profileStrength: 'Forza profilo',
      matchingJobs: 'Lavori corrispondenti',
      cvAnalysis: 'Analisi CV',
      interviewPrep: 'Preparazione colloquio',
      jobMatching: 'Abbinamento lavoro',
      upgrade: 'Aggiorna piano'
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
      filter: 'Filtro',
      apply: 'Applica',
      view: 'Visualizza',
      edit: 'Modifica',
      delete: 'Elimina',
      back: 'Indietro',
      next: 'Avanti',
      previous: 'Precedente',
      close: 'Chiudi',
      submit: 'Invia'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'Il futuro della ricerca del lavoro è qui. Trova il lavoro dei tuoi sogni 10x più velocemente con abbinamento e ottimizzazione IA.',
      features: 'Funzionalità',
      aiJobSearch: 'Ricerca lavoro IA',
      resumeOptimization: 'Ottimizzazione CV',
      interviewPreparation: 'Preparazione colloquio',
      pricing: 'Prezzi',
      support: 'Supporto',
      helpCenter: 'Centro aiuto',
      copyright: '© 2024 SmartJobFit. Tutti i diritti riservati.'
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
      hero: {
        title: 'Encuentra el trabajo de tus sueños 10x más rápido con IA',
        subtitle: 'SmartJobFit utiliza IA avanzada para conectarte con oportunidades de trabajo perfectas, optimizar tu CV y prepararte para entrevistas.',
        cta: 'Comenzar gratis',
        freeTrial: 'Comenzar prueba gratuita'
      },
      features: {
        title: 'Características potentes impulsadas por IA',
        subtitle: 'Todo lo que necesitas para conseguir el trabajo de tus sueños',
        aiSearch: {
          title: 'Búsqueda de trabajo IA',
          description: 'Busca en 15+ sitios de trabajo con coincidencia IA'
        },
        resumeOptimization: {
          title: 'Optimización de CV',
          description: 'Análisis de CV y optimización ATS impulsados por IA'
        },
        interviewPrep: {
          title: 'Preparación de entrevista',
          description: 'Coach IA para entrevistas simuladas y comentarios'
        },
        analytics: {
          title: 'Análisis avanzados',
          description: 'Rastrea tu progreso y optimiza tu estrategia'
        }
      },
      pricing: {
        title: 'Elige tu plan',
        subtitle: 'Comienza gratis, actualiza cuando estés listo',
        monthly: 'Mensual',
        yearly: 'Anual',
        free: {
          title: 'Gratuito',
          price: '$0',
          description: 'Perfecto para empezar',
          features: ['5 búsquedas de trabajo IA por mes', 'Optimización de CV básica', 'Acceso limitado a sitios de trabajo', 'Soporte por email']
        },
        professional: {
          title: 'Profesional',
          price: '$29',
          description: 'Para buscadores de empleo serios',
          features: ['Búsquedas de trabajo IA ilimitadas', 'Optimización de CV avanzada', 'Acceso a todos los 15+ sitios de trabajo', 'Preparación de entrevista IA', 'Soporte prioritario', 'Panel de análisis']
        },
        enterprise: {
          title: 'Coach de Carrera IA',
          price: '$79',
          description: 'Para profesionales de carrera',
          features: ['Todo en Profesional', 'Análisis avanzados', 'IA de negociación salarial', 'Coaching de agente IA', 'Procesamiento prioritario', 'Integraciones personalizadas']
        }
      }
    },
    dashboard: {
      welcome: 'Bienvenido de vuelta',
      quickActions: 'Acciones rápidas',
      recentActivity: 'Actividad reciente',
      analytics: 'Análisis',
      jobSearches: 'Búsquedas de trabajo',
      applications: 'Aplicaciones',
      interviews: 'Entrevistas',
      resumeScore: 'Puntuación de CV',
      profileStrength: 'Fuerza del perfil',
      matchingJobs: 'Trabajos coincidentes',
      cvAnalysis: 'Análisis de CV',
      interviewPrep: 'Preparación de entrevista',
      jobMatching: 'Coincidencia de trabajo',
      upgrade: 'Actualizar plan'
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
      submit: 'Enviar'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'El futuro de la búsqueda de empleo está aquí. Encuentra el trabajo de tus sueños 10x más rápido con coincidencia y optimización IA.',
      features: 'Características',
      aiJobSearch: 'Búsqueda de trabajo IA',
      resumeOptimization: 'Optimización de CV',
      interviewPreparation: 'Preparación de entrevista',
      pricing: 'Precios',
      support: 'Soporte',
      helpCenter: 'Centro de ayuda',
      copyright: '© 2024 SmartJobFit. Todos los derechos reservados.'
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
      hero: {
        title: 'Encontre o emprego dos seus sonhos 10x mais rápido com IA',
        subtitle: 'SmartJobFit usa IA avançada para conectar você com oportunidades de emprego perfeitas, otimizar seu currículo e prepará-lo para entrevistas.',
        cta: 'Começar grátis',
        freeTrial: 'Iniciar teste gratuito'
      },
      features: {
        title: 'Recursos poderosos impulsionados por IA',
        subtitle: 'Tudo que você precisa para conseguir o emprego dos seus sonhos',
        aiSearch: {
          title: 'Busca de emprego IA',
          description: 'Pesquise em 15+ sites de emprego com correspondência IA'
        },
        resumeOptimization: {
          title: 'Otimização de currículo',
          description: 'Análise de currículo e otimização ATS impulsionados por IA'
        },
        interviewPrep: {
          title: 'Preparação para entrevista',
          description: 'Coach IA para entrevistas simuladas e feedback'
        },
        analytics: {
          title: 'Análises avançadas',
          description: 'Acompanhe seu progresso e otimize sua estratégia'
        }
      },
      pricing: {
        title: 'Escolha seu plano',
        subtitle: 'Comece grátis, atualize quando estiver pronto',
        monthly: 'Mensal',
        yearly: 'Anual',
        free: {
          title: 'Gratuito',
          price: 'R$0',
          description: 'Perfeito para começar',
          features: ['5 buscas de emprego IA por mês', 'Otimização de currículo básica', 'Acesso limitado a sites de emprego', 'Suporte por email']
        },
        professional: {
          title: 'Profissional',
          price: 'R$29',
          description: 'Para buscadores de emprego sérios',
          features: ['Buscas de emprego IA ilimitadas', 'Otimização de currículo avançada', 'Acesso a todos os 15+ sites de emprego', 'Preparação para entrevista IA', 'Suporte prioritário', 'Painel de análises']
        },
        enterprise: {
          title: 'Coach de Carreira IA',
          price: 'R$79',
          description: 'Para profissionais de carreira',
          features: ['Tudo no Profissional', 'Análises avançadas', 'IA de negociação salarial', 'Coaching de agente IA', 'Processamento prioritário', 'Integrações personalizadas']
        }
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
      resumeScore: 'Pontuação do currículo',
      profileStrength: 'Força do perfil',
      matchingJobs: 'Empregos correspondentes',
      cvAnalysis: 'Análise de CV',
      interviewPrep: 'Preparação para entrevista',
      jobMatching: 'Correspondência de emprego',
      upgrade: 'Atualizar plano'
    },
    common: {
      getStarted: 'Começar',
      learnMore: 'Saiba mais',
      upgrade: 'Atualizar',
      cancel: 'Cancelar',
      save: 'Salvar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      search: 'Buscar',
      filter: 'Filtrar',
      apply: 'Aplicar',
      view: 'Ver',
      edit: 'Editar',
      delete: 'Excluir',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      close: 'Fechar',
      submit: 'Enviar'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'O futuro da busca de emprego está aqui. Encontre o emprego dos seus sonhos 10x mais rápido com correspondência e otimização IA.',
      features: 'Recursos',
      aiJobSearch: 'Busca de emprego IA',
      resumeOptimization: 'Otimização de currículo',
      interviewPreparation: 'Preparação para entrevista',
      pricing: 'Preços',
      support: 'Suporte',
      helpCenter: 'Centro de ajuda',
      copyright: '© 2024 SmartJobFit. Todos os direitos reservados.'
    }
  },
  ja: {
    nav: {
      home: 'ホーム',
      pricing: '料金',
      features: '機能',
      help: 'ヘルプ',
      login: 'ログイン',
      dashboard: 'ダッシュボード',
      logout: 'ログアウト'
    },
    landing: {
      hero: {
        title: 'AIで理想の仕事を10倍速く見つける',
        subtitle: 'SmartJobFitは高度なAIを使用して、完璧な就職機会とマッチング、履歴書の最適化、面接準備をサポートします。',
        cta: '無料で始める',
        freeTrial: '無料トライアル開始'
      },
      features: {
        title: 'AI駆動の強力な機能',
        subtitle: '理想の仕事を得るために必要なすべて',
        aiSearch: {
          title: 'AI求人検索',
          description: '15+の求人サイトでAIマッチング検索'
        },
        resumeOptimization: {
          title: '履歴書最適化',
          description: 'AI駆動の履歴書分析とATS最適化'
        },
        interviewPrep: {
          title: '面接準備',
          description: '模擬面接とフィードバックのためのAIコーチ'
        },
        analytics: {
          title: '高度な分析',
          description: '進捗を追跡し、戦略を最適化'
        }
      },
      pricing: {
        title: 'プランを選択',
        subtitle: '無料で始めて、準備ができたらアップグレード',
        monthly: '月額',
        yearly: '年額',
        free: {
          title: '無料',
          price: '¥0',
          description: '始めるのに最適',
          features: ['月5回のAI求人検索', '基本的な履歴書最適化', '限定的な求人サイトアクセス', 'メールサポート']
        },
        professional: {
          title: 'プロフェッショナル',
          price: '¥29',
          description: '本格的な求職者向け',
          features: ['無制限AI求人検索', '高度な履歴書最適化', '全15+求人サイトアクセス', 'AI面接準備', '優先サポート', '分析ダッシュボード']
        },
        enterprise: {
          title: 'AIキャリアコーチ',
          price: '¥79',
          description: 'キャリアプロフェッショナル向け',
          features: ['プロフェッショナルの全機能', '高度な分析', '給与交渉AI', 'AIエージェントコーチング', '優先処理', 'カスタム統合']
        }
      }
    },
    dashboard: {
      welcome: 'おかえりなさい',
      quickActions: 'クイックアクション',
      recentActivity: '最近の活動',
      analytics: '分析',
      jobSearches: '求人検索',
      applications: '応募',
      interviews: '面接',
      resumeScore: '履歴書スコア',
      profileStrength: 'プロフィール強度',
      matchingJobs: 'マッチング求人',
      cvAnalysis: 'CV分析',
      interviewPrep: '面接準備',
      jobMatching: '求人マッチング',
      upgrade: 'プランアップグレード'
    },
    common: {
      getStarted: '始める',
      learnMore: '詳しく見る',
      upgrade: 'アップグレード',
      cancel: 'キャンセル',
      save: '保存',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      search: '検索',
      filter: 'フィルター',
      apply: '適用',
      view: '表示',
      edit: '編集',
      delete: '削除',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      close: '閉じる',
      submit: '送信'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: '求職の未来がここにあります。AIマッチングと最適化で理想の仕事を10倍速く見つけましょう。',
      features: '機能',
      aiJobSearch: 'AI求人検索',
      resumeOptimization: '履歴書最適化',
      interviewPreparation: '面接準備',
      pricing: '料金',
      support: 'サポート',
      helpCenter: 'ヘルプセンター',
      copyright: '© 2024 SmartJobFit. 全著作権所有。'
    }
  },
  ko: {
    nav: {
      home: '홈',
      pricing: '가격',
      features: '기능',
      help: '도움말',
      login: '로그인',
      dashboard: '대시보드',
      logout: '로그아웃'
    },
    landing: {
      hero: {
        title: 'AI로 꿈의 직장을 10배 빨리 찾아보세요',
        subtitle: 'SmartJobFit은 첨단 AI를 사용하여 완벽한 취업 기회와 매칭하고, 이력서를 최적화하며, 면접을 준비해 드립니다.',
        cta: '무료로 시작하기',
        freeTrial: '무료 체험 시작'
      },
      features: {
        title: 'AI 기반 강력한 기능',
        subtitle: '꿈의 직장을 얻기 위해 필요한 모든 것',
        aiSearch: {
          title: 'AI 채용 검색',
          description: '15+개 채용 사이트에서 AI 매칭 검색'
        },
        resumeOptimization: {
          title: '이력서 최적화',
          description: 'AI 기반 이력서 분석 및 ATS 최적화'
        },
        interviewPrep: {
          title: '면접 준비',
          description: '모의 면접과 피드백을 위한 AI 코치'
        },
        analytics: {
          title: '고급 분석',
          description: '진행 상황을 추적하고 전략을 최적화'
        }
      },
      pricing: {
        title: '플랜 선택',
        subtitle: '무료로 시작하고, 준비되면 업그레이드',
        monthly: '월간',
        yearly: '연간',
        free: {
          title: '무료',
          price: '₩0',
          description: '시작하기에 완벽',
          features: ['월 5회 AI 채용 검색', '기본 이력서 최적화', '제한된 채용 사이트 액세스', '이메일 지원']
        },
        professional: {
          title: '프로페셔널',
          price: '₩29',
          description: '진지한 구직자를 위한',
          features: ['무제한 AI 채용 검색', '고급 이력서 최적화', '모든 15+개 채용 사이트 액세스', 'AI 면접 준비', '우선 지원', '분석 대시보드']
        },
        enterprise: {
          title: 'AI 커리어 코치',
          price: '₩79',
          description: '커리어 전문가를 위한',
          features: ['프로페셔널의 모든 기능', '고급 분석', '급여 협상 AI', 'AI 에이전트 코칭', '우선 처리', '맞춤 통합']
        }
      }
    },
    dashboard: {
      welcome: '다시 오신 것을 환영합니다',
      quickActions: '빠른 작업',
      recentActivity: '최근 활동',
      analytics: '분석',
      jobSearches: '채용 검색',
      applications: '지원',
      interviews: '면접',
      resumeScore: '이력서 점수',
      profileStrength: '프로필 강도',
      matchingJobs: '매칭 채용',
      cvAnalysis: 'CV 분석',
      interviewPrep: '면접 준비',
      jobMatching: '채용 매칭',
      upgrade: '플랜 업그레이드'
    },
    common: {
      getStarted: '시작하기',
      learnMore: '자세히 보기',
      upgrade: '업그레이드',
      cancel: '취소',
      save: '저장',
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
      search: '검색',
      filter: '필터',
      apply: '적용',
      view: '보기',
      edit: '편집',
      delete: '삭제',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      close: '닫기',
      submit: '제출'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: '구직의 미래가 여기에 있습니다. AI 매칭과 최적화로 꿈의 직장을 10배 빨리 찾아보세요.',
      features: '기능',
      aiJobSearch: 'AI 채용 검색',
      resumeOptimization: '이력서 최적화',
      interviewPreparation: '면접 준비',
      pricing: '가격',
      support: '지원',
      helpCenter: '도움말 센터',
      copyright: '© 2024 SmartJobFit. 모든 권리 보유.'
    }
  },
  zh: {
    nav: {
      home: '首页',
      pricing: '定价',
      features: '功能',
      help: '帮助',
      login: '登录',
      dashboard: '仪表板',
      logout: '登出'
    },
    landing: {
      hero: {
        title: '用AI找到理想工作，速度提升10倍',
        subtitle: 'SmartJobFit使用先进的AI技术，为您匹配完美的工作机会，优化简历，并为面试做准备。',
        cta: '免费开始',
        freeTrial: '开始免费试用'
      },
      features: {
        title: 'AI驱动的强大功能',
        subtitle: '获得理想工作所需的一切',
        aiSearch: {
          title: 'AI求职搜索',
          description: '在15+个求职网站上进行AI匹配搜索'
        },
        resumeOptimization: {
          title: '简历优化',
          description: 'AI驱动的简历分析和ATS优化'
        },
        interviewPrep: {
          title: '面试准备',
          description: '模拟面试和反馈的AI教练'
        },
        analytics: {
          title: '高级分析',
          description: '跟踪进度并优化策略'
        }
      },
      pricing: {
        title: '选择您的计划',
        subtitle: '免费开始，准备好后升级',
        monthly: '月付',
        yearly: '年付',
        free: {
          title: '免费',
          price: '¥0',
          description: '适合入门',
          features: ['每月5次AI求职搜索', '基础简历优化', '有限的求职网站访问', '邮件支持']
        },
        professional: {
          title: '专业版',
          price: '¥29',
          description: '适合认真求职者',
          features: ['无限AI求职搜索', '高级简历优化', '所有15+求职网站访问', 'AI面试准备', '优先支持', '分析仪表板']
        },
        enterprise: {
          title: 'AI职业教练',
          price: '¥79',
          description: '适合职业专业人士',
          features: ['专业版所有功能', '高级分析', '薪资谈判AI', 'AI代理教练', '优先处理', '定制集成']
        }
      }
    },
    dashboard: {
      welcome: '欢迎回来',
      quickActions: '快速操作',
      recentActivity: '最近活动',
      analytics: '分析',
      jobSearches: '求职搜索',
      applications: '申请',
      interviews: '面试',
      resumeScore: '简历评分',
      profileStrength: '资料强度',
      matchingJobs: '匹配工作',
      cvAnalysis: 'CV分析',
      interviewPrep: '面试准备',
      jobMatching: '工作匹配',
      upgrade: '升级计划'
    },
    common: {
      getStarted: '开始',
      learnMore: '了解更多',
      upgrade: '升级',
      cancel: '取消',
      save: '保存',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      search: '搜索',
      filter: '过滤',
      apply: '应用',
      view: '查看',
      edit: '编辑',
      delete: '删除',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      close: '关闭',
      submit: '提交'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: '求职的未来就在这里。通过AI匹配和优化，找到理想工作的速度提升10倍。',
      features: '功能',
      aiJobSearch: 'AI求职搜索',
      resumeOptimization: '简历优化',
      interviewPreparation: '面试准备',
      pricing: '定价',
      support: '支持',
      helpCenter: '帮助中心',
      copyright: '© 2024 SmartJobFit. 保留所有权利。'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      pricing: 'الأسعار',
      features: 'المميزات',
      help: 'المساعدة',
      login: 'تسجيل الدخول',
      dashboard: 'لوحة التحكم',
      logout: 'تسجيل الخروج'
    },
    landing: {
      hero: {
        title: 'اعثر على وظيفة أحلامك بسرعة أكبر 10 مرات بالذكاء الاصطناعي',
        subtitle: 'يستخدم SmartJobFit الذكاء الاصطناعي المتقدم لربطك بفرص العمل المثالية وتحسين سيرتك الذاتية وإعدادك للمقابلات.',
        cta: 'ابدأ مجاناً',
        freeTrial: 'ابدأ التجربة المجانية'
      },
      features: {
        title: 'مميزات قوية مدعومة بالذكاء الاصطناعي',
        subtitle: 'كل ما تحتاجه للحصول على وظيفة أحلامك',
        aiSearch: {
          title: 'البحث عن وظائف بالذكاء الاصطناعي',
          description: 'ابحث في 15+ موقع وظائف مع مطابقة الذكاء الاصطناعي'
        },
        resumeOptimization: {
          title: 'تحسين السيرة الذاتية',
          description: 'تحليل السيرة الذاتية وتحسين ATS مدعوم بالذكاء الاصطناعي'
        },
        interviewPrep: {
          title: 'إعداد المقابلة',
          description: 'مدرب ذكاء اصطناعي للمقابلات التجريبية والتقييم'
        },
        analytics: {
          title: 'تحليلات متقدمة',
          description: 'تتبع تقدمك وحسن استراتيجيتك'
        }
      },
      pricing: {
        title: 'اختر خطتك',
        subtitle: 'ابدأ مجاناً، ترقى عندما تكون مستعداً',
        monthly: 'شهرياً',
        yearly: 'سنوياً',
        free: {
          title: 'مجاني',
          price: '$0',
          description: 'مثالي للبداية',
          features: ['5 عمليات بحث وظائف بالذكاء الاصطناعي شهرياً', 'تحسين السيرة الذاتية الأساسي', 'وصول محدود لمواقع الوظائف', 'دعم البريد الإلكتروني']
        },
        professional: {
          title: 'احترافي',
          price: '$29',
          description: 'للباحثين الجادين عن العمل',
          features: ['بحث وظائف بالذكاء الاصطناعي غير محدود', 'تحسين السيرة الذاتية المتقدم', 'الوصول لجميع 15+ موقع وظائف', 'إعداد المقابلات بالذكاء الاصطناعي', 'دعم أولوية', 'لوحة تحكم التحليلات']
        },
        enterprise: {
          title: 'مدرب المهنة بالذكاء الاصطناعي',
          price: '$79',
          description: 'للمهنيين المحترفين',
          features: ['كل شيء في الاحترافي', 'تحليلات متقدمة', 'ذكاء اصطناعي لتفاوض الراتب', 'تدريب وكيل الذكاء الاصطناعي', 'معالجة أولوية', 'تكاملات مخصصة']
        }
      }
    },
    dashboard: {
      welcome: 'أهلاً بعودتك',
      quickActions: 'إجراءات سريعة',
      recentActivity: 'النشاط الأخير',
      analytics: 'التحليلات',
      jobSearches: 'البحث عن وظائف',
      applications: 'التطبيقات',
      interviews: 'المقابلات',
      resumeScore: 'نقاط السيرة الذاتية',
      profileStrength: 'قوة الملف الشخصي',
      matchingJobs: 'الوظائف المطابقة',
      cvAnalysis: 'تحليل السيرة الذاتية',
      interviewPrep: 'إعداد المقابلة',
      jobMatching: 'مطابقة الوظائف',
      upgrade: 'ترقية الخطة'
    },
    common: {
      getStarted: 'البدء',
      learnMore: 'اعرف المزيد',
      upgrade: 'ترقية',
      cancel: 'إلغاء',
      save: 'حفظ',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      search: 'بحث',
      filter: 'تصفية',
      apply: 'تطبيق',
      view: 'عرض',
      edit: 'تحرير',
      delete: 'حذف',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      submit: 'إرسال'
    },
    footer: {
      company: 'SmartJobFit',
      tagline: 'مستقبل البحث عن الوظائف هنا. اعثر على وظيفة أحلامك بسرعة أكبر 10 مرات مع المطابقة والتحسين بالذكاء الاصطناعي.',
      features: 'المميزات',
      aiJobSearch: 'البحث عن وظائف بالذكاء الاصطناعي',
      resumeOptimization: 'تحسين السيرة الذاتية',
      interviewPreparation: 'إعداد المقابلة',
      pricing: 'الأسعار',
      support: 'الدعم',
      helpCenter: 'مركز المساعدة',
      copyright: '© 2024 SmartJobFit. جميع الحقوق محفوظة.'
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