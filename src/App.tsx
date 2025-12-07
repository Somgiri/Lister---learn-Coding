import { useState } from 'react'
import { ChevronRight, Settings, Info, Home, Code, Palette, Zap, FileCode, Sparkles } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import emailjs from '@emailjs/browser'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { IconCloud } from '@/components/ui/interactive-icon-cloud'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { StarRating } from '@/components/ui/star-rating'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { smartAI } from './ai-brain'
import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'

const translations: any = {
  en: {
    welcome: 'Welcome to',
    startJourney: 'Start Your Coding Journey',
    learnCoding: 'Learn Coding - Your journey to becoming a developer starts here',
    skillLevel: "What's your coding level?",
    continue: 'Continue',
    signIn: 'Sign In / Sign Up',
    whatDevelop: 'What do you want to develop?',
    choosePath: 'Choose your development path',
    selectGoal: 'Select your goal',
    websites: 'Websites',
    mobileApps: 'Mobile Apps',
    webApps: 'Web Apps',
    other: 'Other',
    back: 'Back',
    startLearning: 'Start Learning',
    about: 'About',
    settings: 'Settings',
    home: 'Home',
    courses: 'Courses',
    learnTo: 'Learn to',
    code: 'Code',
    masterProgramming: 'Master programming fundamentals with interactive lessons',
    choosePath2: 'Choose Your Path',
    whyWiskter: 'Why Wiskter?',
    structuredLearning: 'Structured Learning',
    structuredDesc: 'Step-by-step curriculum designed for beginners',
    handsOnPractice: 'Hands-On Practice',
    handsOnDesc: 'Code directly in your browser with instant feedback',
    fastProgress: 'Fast Progress',
    fastProgressDesc: 'Learn at your own pace and track your achievements',
    footer: '© 2025 Wiskter - Learn Coding. Start your coding journey today!',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    selectLevel: 'Select your level',
    learningCoding: 'Learning Coding',
    beginner: 'Beginner',
    knowsBasics: 'Knows Basics',
    expert: 'Expert',
    wantSaveProgress: 'Want to save your progress?',
    signedInSuccess: 'Signed in successfully!',
    progressWillBeSaved: 'Your progress will be saved',
    saveProgress: 'Save your progress',
    signedIn: 'Signed in',
    signOut: 'Sign Out',
    enableNotifications: 'Enable notifications',
    rateWiskter: 'Rate Wiskter',
    shareThoughts: 'Share your thoughts... (optional)',
    submitRating: 'Submit Rating',
    submitFeedback: 'Submit Feedback',
    skip: 'Skip',
    needHelp: 'Need more help? Join our',
    discordServer: 'discord server',
    startCourse: 'Start Course',
    backToCourses: '← Back to Courses',
    courseContent: 'Course Content',
    startLearningWith: 'Start learning',
    interactiveLessons: 'with interactive lessons and hands-on practice',
    lesson: 'Lesson',
    introduction: 'Introduction',
    coreConcepts: 'Core Concepts',
    practiceProject: 'Practice Project',
    getStartedBasics: 'Get started with the basics',
    learnFundamental: 'Learn the fundamental concepts',
    buildSomethingReal: 'Build something real'
  },
  es: {
    welcome: 'Bienvenido a',
    startJourney: 'Comienza tu Viaje de Programación',
    learnCoding: 'Aprende Programación - Tu viaje para convertirte en desarrollador comienza aquí',
    skillLevel: '¿Cuál es tu nivel de programación?',
    continue: 'Continuar',
    signIn: 'Iniciar Sesión / Registrarse',
    whatDevelop: '¿Qué quieres desarrollar?',
    choosePath: 'Elige tu ruta de desarrollo',
    selectGoal: 'Selecciona tu objetivo',
    websites: 'Sitios Web',
    mobileApps: 'Aplicaciones Móviles',
    webApps: 'Aplicaciones Web',
    other: 'Otro',
    back: 'Atrás',
    startLearning: 'Comenzar a Aprender',
    about: 'Acerca de',
    settings: 'Configuración',
    home: 'Inicio',
    courses: 'Cursos',
    learnTo: 'Aprende a',
    code: 'Programar',
    masterProgramming: 'Domina los fundamentos de programación con lecciones interactivas',
    choosePath2: 'Elige Tu Camino',
    whyWiskter: '¿Por qué Wiskter?',
    structuredLearning: 'Aprendizaje Estructurado',
    structuredDesc: 'Currículo paso a paso diseñado para principiantes',
    handsOnPractice: 'Práctica Práctica',
    handsOnDesc: 'Programa directamente en tu navegador con retroalimentación instantánea',
    fastProgress: 'Progreso Rápido',
    fastProgressDesc: 'Aprende a tu propio ritmo y rastrea tus logros',
    footer: '© 2025 Wiskter - Aprende Programación. ¡Comienza tu viaje de programación hoy!',
    theme: 'Tema',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    selectLevel: 'Selecciona tu nivel',
    learningCoding: 'Aprendiendo a programar',
    beginner: 'Principiante',
    knowsBasics: 'Conoce lo básico',
    expert: 'Experto',
    wantSaveProgress: '¿Quieres guardar tu progreso?',
    signedInSuccess: '¡Sesión iniciada con éxito!',
    progressWillBeSaved: 'Tu progreso será guardado',
    saveProgress: 'Guarda tu progreso',
    signedIn: 'Sesión iniciada',
    signOut: 'Cerrar sesión',
    enableNotifications: 'Habilitar notificaciones',
    rateWiskter: 'Califica Wiskter',
    shareThoughts: 'Comparte tus pensamientos... (opcional)',
    submitRating: 'Enviar calificación',
    submitFeedback: 'Enviar comentarios',
    skip: 'Omitir',
    needHelp: '¿Necesitas ayuda? Únete a nuestro',
    discordServer: 'servidor de discord',
    startCourse: 'Comenzar curso',
    backToCourses: '← Volver a Cursos',
    courseContent: 'Contenido del Curso',
    startLearningWith: 'Comienza a aprender',
    interactiveLessons: 'con lecciones interactivas y práctica práctica',
    lesson: 'Lección',
    introduction: 'Introducción',
    coreConcepts: 'Conceptos Básicos',
    practiceProject: 'Proyecto de Práctica',
    getStartedBasics: 'Comienza con lo básico',
    learnFundamental: 'Aprende los conceptos fundamentales',
    buildSomethingReal: 'Construye algo real'
  },
  fr: {
    welcome: 'Bienvenue à',
    startJourney: 'Commencez votre Parcours de Programmation',
    learnCoding: 'Apprendre la Programmation - Votre parcours pour devenir développeur commence ici',
    skillLevel: 'Quel est votre niveau de programmation?',
    continue: 'Continuer',
    signIn: 'Se Connecter / S\'inscrire',
    whatDevelop: 'Que voulez-vous développer?',
    choosePath: 'Choisissez votre parcours de développement',
    selectGoal: 'Sélectionnez votre objectif',
    websites: 'Sites Web',
    mobileApps: 'Applications Mobiles',
    webApps: 'Applications Web',
    other: 'Autre',
    back: 'Retour',
    startLearning: 'Commencer à Apprendre',
    about: 'À propos',
    settings: 'Paramètres',
    home: 'Accueil',
    courses: 'Cours',
    learnTo: 'Apprendre à',
    code: 'Programmer',
    masterProgramming: 'Maîtrisez les fondamentaux de la programmation avec des leçons interactives',
    choosePath2: 'Choisissez Votre Parcours',
    whyWiskter: 'Pourquoi Wiskter?',
    structuredLearning: 'Apprentissage Structuré',
    structuredDesc: 'Curriculum étape par étape conçu pour les débutants',
    handsOnPractice: 'Pratique Pratique',
    handsOnDesc: 'Codez directement dans votre navigateur avec des commentaires instantanés',
    fastProgress: 'Progrès Rapide',
    fastProgressDesc: 'Apprenez à votre rythme et suivez vos réalisations',
    footer: '© 2025 Wiskter - Apprendre la Programmation. Commencez votre parcours de programmation aujourd\'hui!',
    theme: 'Thème',
    language: 'Langue',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    selectLevel: 'Sélectionnez votre niveau',
    learningCoding: 'Apprentissage de la programmation',
    beginner: 'Débutant',
    knowsBasics: 'Connaît les bases',
    expert: 'Expert',
    wantSaveProgress: 'Voulez-vous sauvegarder votre progrès?',
    signedInSuccess: 'Connecté avec succès!',
    progressWillBeSaved: 'Votre progrès sera sauvegardé',
    saveProgress: 'Sauvegarder votre progrès',
    signedIn: 'Connecté',
    signOut: 'Se déconnecter',
    enableNotifications: 'Activer les notifications',
    rateWiskter: 'Évaluer Wiskter',
    shareThoughts: 'Partagez vos pensées... (optionnel)',
    submitRating: 'Soumettre l\'\u00e9valuation',
    submitFeedback: 'Soumettre les commentaires',
    skip: 'Passer',
    needHelp: 'Besoin d\'aide? Rejoignez notre',
    discordServer: 'serveur discord',
    startCourse: 'Commencer le cours',
    backToCourses: '← Retour aux cours',
    courseContent: 'Contenu du cours',
    startLearningWith: 'Commencez à apprendre',
    interactiveLessons: 'avec des leçons interactives et de la pratique',
    lesson: 'Leçon',
    introduction: 'Introduction',
    coreConcepts: 'Concepts de base',
    practiceProject: 'Projet pratique',
    getStartedBasics: 'Commencez avec les bases',
    learnFundamental: 'Apprenez les concepts fondamentaux',
    buildSomethingReal: 'Construisez quelque chose de réel'
  },
  de: {
    welcome: 'Willkommen bei',
    startJourney: 'Beginnen Sie Ihre Programmier-Reise',
    learnCoding: 'Programmieren Lernen - Ihre Reise zum Entwickler beginnt hier',
    skillLevel: 'Wie ist Ihr Programmierniveau?',
    continue: 'Weiter',
    signIn: 'Anmelden / Registrieren',
    whatDevelop: 'Was möchten Sie entwickeln?',
    choosePath: 'Wählen Sie Ihren Entwicklungspfad',
    selectGoal: 'Wählen Sie Ihr Ziel',
    websites: 'Webseiten',
    mobileApps: 'Mobile Apps',
    webApps: 'Web-Apps',
    other: 'Andere',
    back: 'Zurück',
    startLearning: 'Lernen Beginnen',
    about: 'Über',
    settings: 'Einstellungen',
    home: 'Startseite',
    courses: 'Kurse',
    learnTo: 'Lernen zu',
    code: 'Programmieren',
    masterProgramming: 'Meistern Sie Programmiergrundlagen mit interaktiven Lektionen',
    choosePath2: 'Wählen Sie Ihren Weg',
    whyWiskter: 'Warum Wiskter?',
    structuredLearning: 'Strukturiertes Lernen',
    structuredDesc: 'Schritt-für-Schritt-Lehrplan für Anfänger entwickelt',
    handsOnPractice: 'Praktische Übung',
    handsOnDesc: 'Programmieren Sie direkt in Ihrem Browser mit sofortigem Feedback',
    fastProgress: 'Schneller Fortschritt',
    fastProgressDesc: 'Lernen Sie in Ihrem eigenen Tempo und verfolgen Sie Ihre Erfolge',
    footer: '© 2025 Wiskter - Programmieren Lernen. Beginnen Sie heute Ihre Programmierreise!',
    theme: 'Design',
    language: 'Sprache',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    selectLevel: 'Wählen Sie Ihr Niveau',
    learningCoding: 'Programmieren lernen',
    beginner: 'Anfänger',
    knowsBasics: 'Kennt die Grundlagen',
    expert: 'Experte',
    wantSaveProgress: 'Möchten Sie Ihren Fortschritt speichern?',
    signedInSuccess: 'Erfolgreich angemeldet!',
    progressWillBeSaved: 'Ihr Fortschritt wird gespeichert',
    saveProgress: 'Fortschritt speichern',
    signedIn: 'Angemeldet',
    signOut: 'Abmelden',
    enableNotifications: 'Benachrichtigungen aktivieren',
    rateWiskter: 'Wiskter bewerten',
    shareThoughts: 'Teilen Sie Ihre Gedanken... (optional)',
    submitRating: 'Bewertung absenden',
    submitFeedback: 'Feedback absenden',
    skip: 'Überspringen',
    needHelp: 'Brauchen Sie Hilfe? Treten Sie unserem',
    discordServer: 'Discord-Server bei',
    startCourse: 'Kurs starten',
    backToCourses: '← Zurück zu Kursen',
    courseContent: 'Kursinhalt',
    startLearningWith: 'Beginnen Sie zu lernen',
    interactiveLessons: 'mit interaktiven Lektionen und praktischer Übung',
    lesson: 'Lektion',
    introduction: 'Einführung',
    coreConcepts: 'Grundkonzepte',
    practiceProject: 'Praxisprojekt',
    getStartedBasics: 'Beginnen Sie mit den Grundlagen',
    learnFundamental: 'Lernen Sie die grundlegenden Konzepte',
    buildSomethingReal: 'Bauen Sie etwas Echtes'
  },
  zh: {
    welcome: '欢迎来到',
    startJourney: '开始您的编程之旅',
    learnCoding: '学习编程 - 您成为开发者的旅程从这里开始',
    skillLevel: '您的编程水平是什么?',
    continue: '继续',
    signIn: '登录 / 注册',
    whatDevelop: '您想开发什么?',
    choosePath: '选择您的开发路径',
    selectGoal: '选择您的目标',
    websites: '网站',
    mobileApps: '移动应用',
    webApps: 'Web应用',
    other: '其他',
    back: '返回',
    startLearning: '开始学习',
    about: '关于',
    settings: '设置',
    home: '首页',
    courses: '课程',
    learnTo: '学习',
    code: '编程',
    masterProgramming: '通过互动课程掌握编程基础',
    choosePath2: '选择您的路径',
    whyWiskter: '为什么选择Wiskter?',
    structuredLearning: '结构化学习',
    structuredDesc: '为初学者设计的循序渐进课程',
    handsOnPractice: '实践练习',
    handsOnDesc: '直接在浏览器中编程，获得即时反馈',
    fastProgress: '快速进步',
    fastProgressDesc: '按自己的节奏学习并跟踪成就',
    footer: '© 2025 Wiskter - 学习编程。今天开始您的编程之旅！',
    theme: '主题',
    language: '语言',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    selectLevel: '选择你的等级',
    learningCoding: '学习编程',
    beginner: '初学者',
    knowsBasics: '了解基础',
    expert: '专家',
    wantSaveProgress: '想保存你的进度吗?',
    signedInSuccess: '登录成功!',
    progressWillBeSaved: '你的进度将被保存',
    saveProgress: '保存进度',
    signedIn: '已登录',
    signOut: '退出',
    enableNotifications: '启用通知',
    rateWiskter: '评价 Wiskter',
    shareThoughts: '分享你的想法... (可选)',
    submitRating: '提交评价',
    submitFeedback: '提交反馈',
    skip: '跳过',
    needHelp: '需要帮助? 加入我们的',
    discordServer: 'discord服务器',
    startCourse: '开始课程',
    backToCourses: '← 返回课程',
    courseContent: '课程内容',
    startLearningWith: '开始学习',
    interactiveLessons: '通过互动课程和实践',
    lesson: '课程',
    introduction: '介绍',
    coreConcepts: '核心概念',
    practiceProject: '实践项目',
    getStartedBasics: '从基础开始',
    learnFundamental: '学习基本概念',
    buildSomethingReal: '构建真实项目'
  },
  it: {
    welcome: 'Benvenuto a',
    startJourney: 'Inizia il tuo Viaggio nella Programmazione',
    learnCoding: 'Impara a Programmare - Il tuo viaggio per diventare uno sviluppatore inizia qui',
    skillLevel: 'Qual è il tuo livello di programmazione?',
    continue: 'Continua',
    signIn: 'Accedi / Registrati',
    whatDevelop: 'Cosa vuoi sviluppare?',
    choosePath: 'Scegli il tuo percorso di sviluppo',
    selectGoal: 'Seleziona il tuo obiettivo',
    websites: 'Siti Web',
    mobileApps: 'Applicazioni Mobili',
    webApps: 'Applicazioni Web',
    other: 'Altro',
    back: 'Indietro',
    startLearning: 'Inizia ad Imparare',
    about: 'Informazioni',
    settings: 'Impostazioni',
    home: 'Home',
    courses: 'Corsi',
    learnTo: 'Impara a',
    code: 'Programmare',
    masterProgramming: 'Padroneggia le basi della programmazione con lezioni interattive',
    choosePath2: 'Scegli il Tuo Percorso',
    whyWiskter: 'Perché Wiskter?',
    structuredLearning: 'Apprendimento Strutturato',
    structuredDesc: 'Curriculum passo-passo progettato per i principianti',
    handsOnPractice: 'Pratica Pratica',
    handsOnDesc: 'Programma direttamente nel tuo browser con feedback immediato',
    fastProgress: 'Progresso Veloce',
    fastProgressDesc: 'Impara al tuo ritmo e traccia i tuoi risultati',
    footer: '© 2025 Wiskter - Impara a Programmare. Inizia oggi il tuo viaggio nella programmazione!',
    theme: 'Tema',
    language: 'Lingua',
    darkMode: 'Modalità Scura',
    lightMode: 'Modalità Chiara',
    selectLevel: 'Seleziona il tuo livello',
    learningCoding: 'Imparare a programmare',
    beginner: 'Principiante',
    knowsBasics: 'Conosce le basi',
    expert: 'Esperto',
    wantSaveProgress: 'Vuoi salvare i tuoi progressi?',
    signedInSuccess: 'Accesso effettuato con successo!',
    progressWillBeSaved: 'I tuoi progressi saranno salvati',
    saveProgress: 'Salva i tuoi progressi',
    signedIn: 'Connesso',
    signOut: 'Disconnetti',
    enableNotifications: 'Abilita notifiche',
    rateWiskter: 'Valuta Wiskter',
    shareThoughts: 'Condividi i tuoi pensieri... (opzionale)',
    submitRating: 'Invia valutazione',
    submitFeedback: 'Invia feedback',
    skip: 'Salta',
    needHelp: 'Hai bisogno di aiuto? Unisciti al nostro',
    discordServer: 'server discord',
    startCourse: 'Inizia corso',
    backToCourses: '← Torna ai corsi',
    courseContent: 'Contenuto del corso',
    startLearningWith: 'Inizia ad imparare',
    interactiveLessons: 'con lezioni interattive e pratica',
    lesson: 'Lezione',
    introduction: 'Introduzione',
    coreConcepts: 'Concetti base',
    practiceProject: 'Progetto pratico',
    getStartedBasics: 'Inizia con le basi',
    learnFundamental: 'Impara i concetti fondamentali',
    buildSomethingReal: 'Costruisci qualcosa di reale'
  },
  pt: {
    welcome: 'Bem-vindo ao',
    startJourney: 'Comece Sua Jornada de Programação',
    learnCoding: 'Aprenda a Programar - Sua jornada para se tornar um desenvolvedor começa aqui',
    skillLevel: 'Qual é o seu nível de programação?',
    continue: 'Continuar',
    signIn: 'Entrar / Registrar',
    whatDevelop: 'O que você quer desenvolver?',
    choosePath: 'Escolha seu caminho de desenvolvimento',
    selectGoal: 'Selecione seu objetivo',
    websites: 'Sites',
    mobileApps: 'Aplicativos Móveis',
    webApps: 'Aplicativos Web',
    other: 'Outro',
    back: 'Voltar',
    startLearning: 'Começar a Aprender',
    about: 'Sobre',
    settings: 'Configurações',
    home: 'Início',
    courses: 'Cursos',
    learnTo: 'Aprender a',
    code: 'Programar',
    masterProgramming: 'Domine os fundamentos da programação com aulas interativas',
    choosePath2: 'Escolha Seu Caminho',
    whyWiskter: 'Por que Wiskter?',
    structuredLearning: 'Aprendizado Estruturado',
    structuredDesc: 'Currículo passo a passo projetado para iniciantes',
    handsOnPractice: 'Prática Prática',
    handsOnDesc: 'Programe diretamente no seu navegador com feedback instantâneo',
    fastProgress: 'Progresso Rápido',
    fastProgressDesc: 'Aprenda no seu próprio ritmo e acompanhe suas conquistas',
    footer: '© 2025 Wiskter - Aprenda a Programar. Comece sua jornada de programação hoje!',
    theme: 'Tema',
    language: 'Idioma',
    darkMode: 'Modo Escuro',
    lightMode: 'Modo Claro',
    selectLevel: 'Selecione seu nível',
    learningCoding: 'Aprendendo a programar',
    beginner: 'Iniciante',
    knowsBasics: 'Conhece o básico',
    expert: 'Especialista',
    wantSaveProgress: 'Quer salvar seu progresso?',
    signedInSuccess: 'Login realizado com sucesso!',
    progressWillBeSaved: 'Seu progresso será salvo',
    saveProgress: 'Salvar progresso',
    signedIn: 'Conectado',
    signOut: 'Sair',
    enableNotifications: 'Ativar notificações',
    rateWiskter: 'Avaliar Wiskter',
    shareThoughts: 'Compartilhe seus pensamentos... (opcional)',
    submitRating: 'Enviar avaliação',
    submitFeedback: 'Enviar feedback',
    skip: 'Pular',
    needHelp: 'Precisa de ajuda? Junte-se ao nosso',
    discordServer: 'servidor discord',
    startCourse: 'Iniciar curso',
    backToCourses: '← Voltar aos cursos',
    courseContent: 'Conteúdo do curso',
    startLearningWith: 'Comece a aprender',
    interactiveLessons: 'com lições interativas e prática',
    lesson: 'Lição',
    introduction: 'Introdução',
    coreConcepts: 'Conceitos básicos',
    practiceProject: 'Projeto prático',
    getStartedBasics: 'Comece com o básico',
    learnFundamental: 'Aprenda os conceitos fundamentais',
    buildSomethingReal: 'Construa algo real'
  },
  ru: {
    welcome: 'Добро пожаловать в',
    startJourney: 'Начните свой путь в программировании',
    learnCoding: 'Изучайте программирование - Ваш путь к становлению разработчиком начинается здесь',
    skillLevel: 'Каков ваш уровень программирования?',
    continue: 'Продолжить',
    signIn: 'Войти / Зарегистрироваться',
    whatDevelop: 'Что вы хотите разработать?',
    choosePath: 'Выберите свой путь развития',
    selectGoal: 'Выберите свою цель',
    websites: 'Веб-сайты',
    mobileApps: 'Мобильные приложения',
    webApps: 'Веб-приложения',
    other: 'Другое',
    back: 'Назад',
    startLearning: 'Начать обучение',
    about: 'О нас',
    settings: 'Настройки',
    home: 'Главная',
    courses: 'Курсы',
    learnTo: 'Научиться',
    code: 'Программировать',
    masterProgramming: 'Освойте основы программирования с интерактивными уроками',
    choosePath2: 'Выберите свой путь',
    whyWiskter: 'Почему Wiskter?',
    structuredLearning: 'Структурированное обучение',
    structuredDesc: 'Пошаговая учебная программа, разработанная для новичков',
    handsOnPractice: 'Практическая работа',
    handsOnDesc: 'Программируйте прямо в браузере с мгновенной обратной связью',
    fastProgress: 'Быстрый прогресс',
    fastProgressDesc: 'Учитесь в своем темпе и отслеживайте свои достижения',
    footer: '© 2025 Wiskter - Изучайте программирование. Начните свой путь в программировании сегодня!',
    theme: 'Тема',
    language: 'Язык',
    darkMode: 'Темный режим',
    lightMode: 'Светлый режим',
    selectLevel: 'Выберите свой уровень',
    learningCoding: 'Изучение программирования',
    beginner: 'Начинающий',
    knowsBasics: 'Знает основы',
    expert: 'Эксперт',
    wantSaveProgress: 'Хотите сохранить свой прогресс?',
    signedInSuccess: 'Успешный вход!',
    progressWillBeSaved: 'Ваш прогресс будет сохранен',
    saveProgress: 'Сохранить прогресс',
    signedIn: 'Вошли',
    signOut: 'Выйти',
    enableNotifications: 'Включить уведомления',
    rateWiskter: 'Оценить Wiskter',
    shareThoughts: 'Поделитесь своими мыслями... (опционально)',
    submitRating: 'Отправить оценку',
    submitFeedback: 'Отправить отзыв',
    skip: 'Пропустить',
    needHelp: 'Нужна помощь? Присоединяйтесь к нашему',
    discordServer: 'серверу discord',
    startCourse: 'Начать курс',
    backToCourses: '← Назад к курсам',
    courseContent: 'Содержание курса',
    startLearningWith: 'Начните учиться',
    interactiveLessons: 'с интерактивными уроками и практикой',
    lesson: 'Урок',
    introduction: 'Введение',
    coreConcepts: 'Основные концепции',
    practiceProject: 'Практический проект',
    getStartedBasics: 'Начните с основ',
    learnFundamental: 'Изучите основные концепции',
    buildSomethingReal: 'Постройте что-то реальное'
  },
  ja: {
    welcome: 'ようこそ',
    startJourney: 'プログラミングの旅を始めましょう',
    learnCoding: 'プログラミングを学ぶ - 開発者になる旅がここから始まります',
    skillLevel: 'あなたのプログラミングレベルは？',
    continue: '続ける',
    signIn: 'ログイン / 登録',
    whatDevelop: '何を開発したいですか？',
    choosePath: '開発パスを選択',
    selectGoal: '目標を選択',
    websites: 'ウェブサイト',
    mobileApps: 'モバイルアプリ',
    webApps: 'ウェブアプリ',
    other: 'その他',
    back: '戻る',
    startLearning: '学習を始める',
    about: '概要',
    settings: '設定',
    home: 'ホーム',
    courses: 'コース',
    learnTo: '学ぶ',
    code: 'プログラミング',
    masterProgramming: 'インタラクティブなレッスンでプログラミングの基礎をマスター',
    choosePath2: 'パスを選択',
    whyWiskter: 'なぜWiskterなのか？',
    structuredLearning: '構造化学習',
    structuredDesc: '初心者向けに設計されたステップバイステップのカリキュラム',
    handsOnPractice: '実践練習',
    handsOnDesc: 'ブラウザで直接コードを書き、即座にフィードバックを受ける',
    fastProgress: '速い進歩',
    fastProgressDesc: '自分のペースで学び、成果を追跡',
    footer: '© 2025 Wiskter - プログラミングを学ぶ。今日からプログラミングの旅を始めましょう！',
    theme: 'テーマ',
    language: '言語',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    selectLevel: 'レベルを選択',
    learningCoding: 'プログラミングを学ぶ',
    beginner: '初心者',
    knowsBasics: '基礎を知っている',
    expert: 'エキスパート',
    wantSaveProgress: '進捗を保存しますか?',
    signedInSuccess: 'ログイン成功!',
    progressWillBeSaved: '進捗が保存されます',
    saveProgress: '進捗を保存',
    signedIn: 'ログイン済み',
    signOut: 'ログアウト',
    enableNotifications: '通知を有効にする',
    rateWiskter: 'Wiskterを評価',
    shareThoughts: 'あなたの考えを共有... (オプション)',
    submitRating: '評価を送信',
    submitFeedback: 'フィードバックを送信',
    skip: 'スキップ',
    needHelp: 'ヘルプが必要ですか? 私たちの',
    discordServer: 'discordサーバーに参加',
    startCourse: 'コースを開始',
    backToCourses: '← コースに戻る',
    courseContent: 'コース内容',
    startLearningWith: '学習を開始',
    interactiveLessons: 'インタラクティブレッスンと実践',
    lesson: 'レッスン',
    introduction: '導入',
    coreConcepts: 'コアコンセプト',
    practiceProject: '実践プロジェクト',
    getStartedBasics: '基礎から始める',
    learnFundamental: '基本概念を学ぶ',
    buildSomethingReal: '実際のものを作る'
  },
  ko: {
    welcome: '환영합니다',
    startJourney: '프로그래밍 여정을 시작하세요',
    learnCoding: '코딩 배우기 - 개발자가 되는 여정이 여기서 시작됩니다',
    skillLevel: '귀하의 코딩 수준은?',
    continue: '계속',
    signIn: '로그인 / 회원가입',
    whatDevelop: '무엇을 개발하고 싶으신가요?',
    choosePath: '개발 경로를 선택하세요',
    selectGoal: '목표를 선택하세요',
    websites: '웹사이트',
    mobileApps: '모바일 앱',
    webApps: '웹 앱',
    other: '기타',
    back: '뒤로',
    startLearning: '학습 시작',
    about: '소개',
    settings: '설정',
    home: '홈',
    courses: '강의',
    learnTo: '배우기',
    code: '코딩',
    masterProgramming: '인터랙티브 레슨으로 프로그래밍 기본기를 마스터하세요',
    choosePath2: '경로 선택',
    whyWiskter: '왜 Wiskter인가?',
    structuredLearning: '구조화된 학습',
    structuredDesc: '초보자를 위해 설계된 단계별 커리큘럼',
    handsOnPractice: '실습 연습',
    handsOnDesc: '브라우저에서 직접 코드를 작성하고 즉각적인 피드백을 받으세요',
    fastProgress: '빠른 진전',
    fastProgressDesc: '자신의 페이스로 배우고 성과를 추적하세요',
    footer: '© 2025 Wiskter - 코딩 배우기. 오늘부터 프로그래밍 여정을 시작하세요!',
    theme: '테마',
    language: '언어',
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    selectLevel: '레벨 선택',
    learningCoding: '코딩 학습',
    beginner: '초보자',
    knowsBasics: '기초 지식 보유',
    expert: '전문가',
    wantSaveProgress: '진행 상황을 저장하시겠습니까?',
    signedInSuccess: '로그인 성공!',
    progressWillBeSaved: '진행 상황이 저장됩니다',
    saveProgress: '진행 상황 저장',
    signedIn: '로그인됨',
    signOut: '로그아웃',
    enableNotifications: '알림 활성화',
    rateWiskter: 'Wiskter 평가',
    shareThoughts: '생각을 공유하세요... (선택 사항)',
    submitRating: '평가 제출',
    submitFeedback: '피드백 제출',
    skip: '건너뛰기',
    needHelp: '도움이 필요하신가요? 우리의',
    discordServer: 'discord 서버에 참여',
    startCourse: '코스 시작',
    backToCourses: '← 코스로 돌아가기',
    courseContent: '코스 콘텐츠',
    startLearningWith: '학습 시작',
    interactiveLessons: '인터랙티브 레슨과 실습',
    lesson: '레슨',
    introduction: '소개',
    coreConcepts: '핵심 개념',
    practiceProject: '실습 프로젝트',
    getStartedBasics: '기초부터 시작',
    learnFundamental: '기본 개념 학습',
    buildSomethingReal: '실제 프로젝트 구축'
  },
  ar: {
    welcome: 'مرحبا بك في',
    startJourney: 'ابدأ رحلة البرمجة الخاصة بك',
    learnCoding: 'تعلم البرمجة - رحلتك لتصبح مطوراً تبدأ هنا',
    skillLevel: 'ما هو مستوى البرمجة الخاص بك؟',
    continue: 'متابعة',
    signIn: 'تسجيل الدخول / التسجيل',
    whatDevelop: 'ماذا تريد أن تطور؟',
    choosePath: 'اختر مسار تطويرك',
    selectGoal: 'اختر هدفك',
    websites: 'مواقع الويب',
    mobileApps: 'تطبيقات الهاتف',
    webApps: 'تطبيقات الويب',
    other: 'أخرى',
    back: 'عودة',
    startLearning: 'ابدأ التعلم',
    about: 'حول',
    settings: 'الإعدادات',
    home: 'الرئيسية',
    courses: 'الدورات',
    learnTo: 'تعلم',
    code: 'البرمجة',
    masterProgramming: 'اتقان أساسيات البرمجة مع دروس تفاعلية',
    choosePath2: 'اختر مسارك',
    whyWiskter: 'لماذا Wiskter؟',
    structuredLearning: 'التعلم المنظم',
    structuredDesc: 'مناهج دراسية خطوة بخطوة مصممة للمبتدئين',
    handsOnPractice: 'ممارسة عملية',
    handsOnDesc: 'البرمجة مباشرة في المتصفح مع ملاحظات فورية',
    fastProgress: 'تقدم سريع',
    fastProgressDesc: 'تعلم بوتيرتك الخاصة وتتبع إنجازاتك',
    footer: '© 2025 Wiskter - تعلم البرمجة. ابدأ رحلة البرمجة الخاصة بك اليوم!',
    theme: 'السمة',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    selectLevel: 'اختر مستواك',
    learningCoding: 'تعلم البرمجة',
    beginner: 'مبتدئ',
    knowsBasics: 'يعرف الأساسيات',
    expert: 'خبير',
    wantSaveProgress: 'هل تريد حفظ تقدمك؟',
    signedInSuccess: 'تم تسجيل الدخول بنجاح!',
    progressWillBeSaved: 'سيتم حفظ تقدمك',
    saveProgress: 'حفظ التقدم',
    signedIn: 'تم تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    enableNotifications: 'تفعيل الإشعارات',
    rateWiskter: 'قيم Wiskter',
    shareThoughts: 'شارك أفكارك... (اختياري)',
    submitRating: 'إرسال التقييم',
    submitFeedback: 'إرسال الملاحظات',
    skip: 'تخطي',
    needHelp: 'هل تحتاج إلى مساعدة؟ انضم إلى',
    discordServer: 'خادم discord',
    startCourse: 'بدء الدورة',
    backToCourses: '← العودة إلى الدورات',
    courseContent: 'محتوى الدورة',
    startLearningWith: 'ابدأ التعلم',
    interactiveLessons: 'مع دروس تفاعلية وممارسة',
    lesson: 'درس',
    introduction: 'مقدمة',
    coreConcepts: 'المفاهيم الأساسية',
    practiceProject: 'مشروع عملي',
    getStartedBasics: 'ابدأ بالأساسيات',
    learnFundamental: 'تعلم المفاهيم الأساسية',
    buildSomethingReal: 'ابنِ شيئًا حقيقيًا'
  },
  hi: {
    welcome: 'आपका स्वागत है',
    startJourney: 'अपनी कोडिंग यात्रा शुरू करें',
    learnCoding: 'कोडिंग सीखें - डेवलपर बनने की आपकी यात्रा यहां से शुरू होती है',
    skillLevel: 'आपका कोडिंग स्तर क्या है?',
    continue: 'जारी रखें',
    signIn: 'लॉग इन / साइन अप',
    whatDevelop: 'आप क्या विकसित करना चाहते हैं?',
    choosePath: 'अपना विकास पथ चुनें',
    selectGoal: 'अपना लक्ष्य चुनें',
    websites: 'वेबसाइटें',
    mobileApps: 'मोबाइल ऐप्स',
    webApps: 'वेब ऐप्स',
    other: 'अन्य',
    back: 'वापस',
    startLearning: 'सीखना शुरू करें',
    about: 'बारे में',
    settings: 'सेटिंग्स',
    home: 'होम',
    courses: 'पाठ्यक्रम',
    learnTo: 'सीखें',
    code: 'कोडिंग',
    masterProgramming: 'इंटरैक्टिव पाठ के साथ प्रोग्रामिंग की मूल बातें सीखें',
    choosePath2: 'अपना पथ चुनें',
    whyWiskter: 'व्हाई Wiskter?',
    structuredLearning: 'संरचित शिक्षा',
    structuredDesc: 'शुरुआती लोगों के लिए डिज़ाइन किया गया चरण-दर-चरण पाठ्यक्रम',
    handsOnPractice: 'हाथ से करके अभ्यास',
    handsOnDesc: 'ब्राउज़र में सीधे कोड करें और तुरंत प्रतिक्रिया प्राप्त करें',
    fastProgress: 'तेज़ प्रगति',
    fastProgressDesc: 'अपनी गति से सीखें और अपनी उपलब्धियों को ट्रैक करें',
    footer: '© 2025 Wiskter - कोडिंग सीखें। आज ही अपनी कोडिंग यात्रा शुरू करें!',
    theme: 'थीम',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    selectLevel: 'अपना स्तर चुनें',
    learningCoding: 'कोडिंग सीख रहे हैं',
    beginner: 'शुरुआती',
    knowsBasics: 'मूल बातें जानते हैं',
    expert: 'विशेषज्ञ',
    wantSaveProgress: 'क्या आप अपनी प्रगति सहेजना चाहते हैं?',
    signedInSuccess: 'सफलतापूर्वक साइन इन!',
    progressWillBeSaved: 'आपकी प्रगति सहेजी जाएगी',
    saveProgress: 'प्रगति सहेजें',
    signedIn: 'साइन इन',
    signOut: 'साइन आउट',
    enableNotifications: 'सूचनाएं सक्षम करें',
    rateWiskter: 'Wiskter को रेट करें',
    shareThoughts: 'अपने विचार साझा करें... (वैकल्पिक)',
    submitRating: 'रेटिंग जमा करें',
    submitFeedback: 'फीडबैक जमा करें',
    skip: 'छोड़ें',
    needHelp: 'मदद चाहिए? हमारे साथ जुड़ें',
    discordServer: 'discord सर्वर',
    startCourse: 'कोर्स शुरू करें',
    backToCourses: '← कोर्स पर वापस',
    courseContent: 'कोर्स सामग्री',
    startLearningWith: 'सीखना शुरू करें',
    interactiveLessons: 'इंटरैक्टिव पाठ और अभ्यास के साथ',
    lesson: 'पाठ',
    introduction: 'परिचय',
    coreConcepts: 'मूल अवधारणाएं',
    practiceProject: 'अभ्यास परियोजना',
    getStartedBasics: 'मूल बातों से शुरू करें',
    learnFundamental: 'मूलभूत अवधारणाएं सीखें',
    buildSomethingReal: 'कुछ वास्तविक बनाएं'
  },
  et: {
    welcome: 'Tere tulemast',
    startJourney: 'Alusta oma programmeerimise teekonda',
    learnCoding: 'Õpi programmeerimist - Sinu teekond arendajaks algab siit',
    skillLevel: 'Milline on sinu programmeerimise tase?',
    continue: 'Jätka',
    signIn: 'Logi sisse / Registreeru',
    whatDevelop: 'Mida soovid arendada?',
    choosePath: 'Vali oma arendussuund',
    selectGoal: 'Vali oma eesmärk',
    websites: 'Veebilehed',
    mobileApps: 'Mobiilirakendused',
    webApps: 'Veebirakendused',
    other: 'Muu',
    back: 'Tagasi',
    startLearning: 'Alusta õppimist',
    about: 'Meist',
    settings: 'Seaded',
    home: 'Avaleht',
    courses: 'Kursused',
    learnTo: 'Õpi',
    code: 'Programmeerima',
    masterProgramming: 'Omanda programmeerimise alused interaktiivsete õppetundidega',
    choosePath2: 'Vali oma tee',
    whyWiskter: 'Miks Wiskter?',
    structuredLearning: 'Struktureeritud õppimine',
    structuredDesc: 'Samm-sammult õppekava algajatele',
    handsOnPractice: 'Praktiline harjutamine',
    handsOnDesc: 'Programmeeri otse brauseris kohese tagasisidega',
    fastProgress: 'Kiire progress',
    fastProgressDesc: 'Õpi omas tempos ja jälgi oma saavutusi',
    footer: '© 2025 Wiskter - Õpi programmeerimist. Alusta oma programmeerimise teekonda täna!',
    theme: 'Teema',
    language: 'Keel',
    darkMode: 'Tume režiim',
    lightMode: 'Hele režiim',
    selectLevel: 'Vali oma tase',
    learningCoding: 'Õpin programmeerimist',
    beginner: 'Algaja',
    knowsBasics: 'Tean põhitõdesid',
    expert: 'Ekspert',
    whatToBuild: 'Mida soovid ehitada?',
    saveProgress: 'Salvesta oma progress',
    signedIn: 'Sisse logitud',
    signOut: 'Logi välja',
    enableNotifications: 'Luba teavitused',
    rateWiskter: 'Hinda Wiskterit',
    shareThoughts: 'Jaga oma mõtteid... (valikuline)',
    submitRating: 'Esita hinnang',
    submitFeedback: 'Esita tagasiside',
    skip: 'Jäta vahele',
    needHelp: 'Vajad abi? Liitu meie',
    discordServer: 'discord serveriga',
    versionNumber: 'Versioon 1.2',
    whatsNewTitle: 'Mis on uut? 🎉',
    interactiveButton: 'Interaktiivne hõljumisnupp',
    interactiveButtonDesc: 'Uus animeeritud nupukomponent sujuvate hõljumisefektidega',
    aiAssistant: 'AI õppeassistent',
    aiAssistantDesc: 'Saa kohest abi programmeerimisküsimustega meie nutikalt chatbotilt',
    freeWillPlayground: 'Vaba tahe mänguväljak',
    freeWillPlaygroundDesc: 'Programmeeri vabalt HTML, CSS ja JavaScriptiga reaalajas',
    multiLanguage: 'Mitmekeelne tugi',
    multiLanguageDesc: 'Õpi 13+ keeles, sealhulgas inglise, hispaania, hiina, eesti ja muud',
    findInSettings: '📍 Leia: Seaded → Keel',
    rateWiskterFeature: 'Hinda Wiskterit',
    rateWiskterDesc: 'Jaga oma tagasisidet ja hinda oma õppimiskogemust',
    findInRating: '📍 Leia: Seaded → Hinda Wiskterit',
    discordCommunity: 'Discord kogukond',
    discordCommunityDesc: 'Liitu meie Discord serveriga abi, arutelude ja kogukonna toe saamiseks',
    findInDiscord: '📍 Leia: Seaded → Discord link',
    improvedUI: 'Täiustatud kasutajaliides',
    improvedUIDesc: 'Täiustatud disain parema navigeerimise ja sujuvamate animatsioonidega',
    wantSaveProgress: 'Soovid oma progressi salvestada?',
    signedInSuccess: 'Edukalt sisse logitud!',
    progressWillBeSaved: 'Sinu progress salvestatakse',
    createAccount: 'Loo konto oma progressi salvestamiseks',
    welcomeBack: 'Tere tulemast tagasi! Logi sisse, et jätkata õppimist',
    username: 'Kasutajanimi',
    enterUsername: 'Sisesta oma kasutajanimi',
    email: 'E-post',
    enterEmail: 'Sisesta oma e-post',
    password: 'Parool',
    enterPassword: 'Sisesta oma parool',
    alreadyHaveAccount: 'Kas sul on juba konto? Logi sisse',
    dontHaveAccount: 'Kas sul pole kontot? Registreeru',
    accountExists: 'Konto on juba olemas! Palun logi sisse.',
    invalidCredentials: 'Vale e-post või parool!',
    signUp: 'Registreeru',
    backToCourses: '← Tagasi kursustele',
    backToLessons: '← Tagasi õppetundidele',
    courseContent: 'Kursuse sisu',
    startLearningWith: 'Alusta õppimist',
    interactiveLessons: 'interaktiivsete õppetundide ja praktilise harjutamisega',
    lesson: 'Õppetund',
    introduction: 'Sissejuhatus',
    coreConcepts: 'Põhimõisted',
    practiceProject: 'Harjutusprojekt',
    getStartedBasics: 'Alusta põhitõdedega',
    learnFundamental: 'Õpi põhimõisteid',
    buildSomethingReal: 'Ehita midagi päriselt',
    whatYouLearn: 'Mida sa õpid:',
    understandingFundamentals: '✓ Põhitõdede mõistmine',
    handsOnPracticeItem: '✓ Praktiline harjutamine',
    realWorldExamples: '✓ Pärismaailma näited',
    startLearningBtn: 'Alusta õppimist',
    help: '🤖 Abi',
    nextStep: 'Järgmine samm',
    previous: 'Eelmine',
    hint: '🤖 Vihje',
    next: 'Järgmine',
    complete: 'Lõpeta',
    task: 'Ülesanne',
    of: '/',
    writeYourCode: 'Kirjuta oma kood siia...',
    output: 'Väljund:',
    lessonComplete: 'Õppetund lõpetatud!',
    completed: '✓ LÕPETATUD',
    congratulations: 'Palju õnne! Sa oled selle õppetunni lõpetanud.',
    tryAgain: 'Proovi uuesti',
    backToCourse: 'Tagasi kursusele',
    quitLesson: 'Välju õppetunnist?',
    areYouSure: 'Kas oled kindel, et soovid sellest õppetunnist väljuda?',
    progressWillBeLost: '⚠️ Sinu progress läheb kaotsi!',
    cancel: 'Tühista',
    quitLessonBtn: 'Välju õppetunnist',
    rateExperience: 'Hinda oma kogemust',
    howWasLesson: 'Kuidas oli see õppetund?',
    awesome: 'Suurepärane!',
    gotItRight: 'Sa said selle õigesti! Jätka!',
    welcomeBackTitle: 'Tere tulemast tagasi!',
    successfullySigned: 'Edukalt sisse logitud 🎉',
    thankYou: 'Täname!',
    appreciateFeedback: 'Me hindame sinu tagasisidet! 💙',
    freeWillPlaygroundTitle: 'Vaba tahe mänguväljak',
    preview: 'Eelvaade',
    tipEdit: '💡 Vihje: Muuda oma HTML, CSS ja JavaScript faile. Eelvaade uueneb automaatselt!',
    startCourse: 'Alusta kursust'
  }
}

const t = (key: string, lang: string) => {
  return translations[lang as keyof typeof translations]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en]
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [skillLevel, setSkillLevel] = useState('')
  const [developmentGoal, setDevelopmentGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [showGoalScreen, setShowGoalScreen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [learningPath, setLearningPath] = useState('')
  const [activeCourse, setActiveCourse] = useState('')
  const [activeLesson, setActiveLesson] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userCode, setUserCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [currentTask, setCurrentTask] = useState(1)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showMiniRobot, setShowMiniRobot] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [codeOutput, setCodeOutput] = useState('')
  const [showQuitDialog, setShowQuitDialog] = useState(false)
  const [quitAction, setQuitAction] = useState<(() => void) | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignInAnimation, setShowSignInAnimation] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [websiteRating, setWebsiteRating] = useState(0)
  const [websiteFeedback, setWebsiteFeedback] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<{text: string, isBot: boolean}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewCode, setPreviewCode] = useState('')
  const [showFreeWill, setShowFreeWill] = useState(false)
  const [freeWillFiles, setFreeWillFiles] = useState({
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}',
    js: 'console.log("Hello from JavaScript!");\n\n// Your code here'
  })
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [language, setLanguage] = useState('en')
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [showFreeWillChat, setShowFreeWillChat] = useState(false)
  const [freeWillChatMessages, setFreeWillChatMessages] = useState<{text: string, isBot: boolean}[]>([])
  const [freeWillChatInput, setFreeWillChatInput] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [showTerminal, setShowTerminal] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const getAIResponse = async (userMsg: string) => {
    setChatHistory(prev => [...prev.slice(-10), userMsg.toLowerCase()]);
    
    const task = currentStep === 2 ? tasks[currentTask - 1] : null;
    const taskCode = task ? task.instruction.replace('Write: ', '') : '';
    const course = (activeCourse || 'coding').toLowerCase();
    
    try {
      const aiResponse = await smartAI(userMsg, {
        currentStep,
        task,
        taskCode,
        course,
        activeLesson,
        currentTask,
        totalTasks,
        chatHistory
      });
      return aiResponse;
    } catch (error) {
      return getUniversalAIResponse(userMsg, { task, taskCode, course, currentStep });
    }
  };

  const getUniversalAIResponse = (userMsg: string, context: any) => {
    const msg = userMsg.toLowerCase();
    
    // Science questions
    if (/\b(atom|molecule|chemistry|physics|biology|science|gravity|electron|proton|neutron|dna|cell|photosynthesis|evolution|quantum)\b/i.test(msg)) {
      if (msg.includes('atom')) return '⚛️ **Atoms** are the basic building blocks of matter. They consist of protons, neutrons (in the nucleus), and electrons (orbiting around). Everything you see is made of atoms!';
      if (msg.includes('gravity')) return '🌍 **Gravity** is the force that attracts objects with mass toward each other. It keeps us on Earth and planets orbiting the sun. Discovered by Isaac Newton!';
      if (msg.includes('dna')) return '🧬 **DNA** (Deoxyribonucleic Acid) is the molecule that carries genetic instructions for life. It has a double helix structure and determines your traits!';
      if (msg.includes('photosynthesis')) return '🌱 **Photosynthesis** is how plants make food using sunlight, water, and CO2. They produce oxygen as a byproduct - that\'s why plants are essential for life!';
      return '🔬 **Science** helps us understand the natural world through observation and experimentation. What specific science topic interests you?';
    }
    
    // Math questions
    if (/\b(math|algebra|geometry|calculus|equation|formula|calculate|solve|number|fraction|decimal|percentage)\b/i.test(msg)) {
      if (msg.includes('algebra')) return '📐 **Algebra** uses letters and symbols to represent numbers in equations. Example: x + 5 = 10, so x = 5. It\'s the foundation of advanced math!';
      if (msg.includes('geometry')) return '📏 **Geometry** studies shapes, sizes, and positions. Circles, triangles, squares - all have unique properties and formulas!';
      if (msg.includes('calculus')) return '📊 **Calculus** deals with rates of change (derivatives) and accumulation (integrals). It\'s used in physics, engineering, and economics!';
      if (msg.includes('percentage')) return '💯 **Percentages** represent parts per hundred. To find 20% of 50: (20/100) × 50 = 10. Useful for discounts, taxes, and statistics!';
      return '🔢 **Mathematics** is the language of patterns and logic. What math concept would you like to explore?';
    }
    
    // History questions
    if (/\b(history|war|ancient|civilization|empire|revolution|president|king|queen|battle|treaty)\b/i.test(msg)) {
      if (msg.includes('ancient')) return '🏛️ **Ancient civilizations** like Egypt, Greece, Rome, and Mesopotamia laid foundations for modern society - writing, laws, architecture, and philosophy!';
      if (msg.includes('revolution')) return '⚔️ **Revolutions** are major social/political upheavals. Examples: American Revolution (1776), French Revolution (1789), Industrial Revolution (1760s-1840s).';
      if (msg.includes('world war')) return '🌍 **World Wars**: WWI (1914-1918) and WWII (1939-1945) were global conflicts that reshaped the modern world and led to major technological advances.';
      return '📜 **History** teaches us about past events, cultures, and how humanity evolved. What historical period interests you?';
    }
    
    // Geography questions
    if (/\b(country|continent|ocean|mountain|river|capital|geography|earth|planet|map)\b/i.test(msg)) {
      if (msg.includes('continent')) return '🗺️ **7 Continents**: Africa, Antarctica, Asia, Australia, Europe, North America, South America. Asia is the largest, Australia is the smallest!';
      if (msg.includes('ocean')) return '🌊 **5 Oceans**: Pacific (largest), Atlantic, Indian, Southern, Arctic. Oceans cover 71% of Earth\'s surface!';
      if (msg.includes('mountain')) return '⛰️ **Mount Everest** (8,849m) is Earth\'s highest mountain. Mountains form through tectonic plate movements over millions of years!';
      return '🌍 **Geography** studies Earth\'s landscapes, environments, and places. What location would you like to learn about?';
    }
    
    // Technology questions
    if (/\b(computer|internet|ai|artificial intelligence|robot|technology|software|hardware|app|website|digital)\b/i.test(msg)) {
      if (msg.includes('ai') || msg.includes('artificial intelligence')) return '🤖 **AI** (Artificial Intelligence) enables machines to learn and make decisions. I\'m an AI helping you learn! AI powers voice assistants, recommendations, and more.';
      if (msg.includes('internet')) return '🌐 **The Internet** is a global network connecting billions of devices. It uses protocols like HTTP, TCP/IP to transmit data worldwide instantly!';
      if (msg.includes('computer')) return '💻 **Computers** process data using binary (0s and 1s). They have CPU (brain), RAM (short-term memory), and storage (long-term memory).';
      return '⚡ **Technology** is constantly evolving! From smartphones to space exploration, tech shapes our modern world. What tech topic interests you?';
    }
    
    // Language & Literature
    if (/\b(language|grammar|verb|noun|adjective|literature|book|author|poem|story|write|writing)\b/i.test(msg)) {
      if (msg.includes('grammar')) return '📝 **Grammar** is the structure of language. Key parts: nouns (people/things), verbs (actions), adjectives (descriptions), adverbs (how/when).';
      if (msg.includes('literature')) return '📚 **Literature** includes novels, poetry, plays, and essays. Famous authors: Shakespeare, Dickens, Austen, Hemingway, Rowling!';
      if (msg.includes('writing')) return '✍️ **Good writing** needs: clear ideas, proper structure, engaging style, and correct grammar. Practice makes perfect!';
      return '📖 **Language** is how we communicate ideas. Every language has unique grammar, vocabulary, and cultural context!';
    }
    
    // Philosophy & Life questions
    if (/\b(meaning|life|purpose|philosophy|exist|why|think|consciousness|mind|soul|happiness)\b/i.test(msg)) {
      if (msg.includes('meaning') || msg.includes('purpose')) return '🤔 **Life\'s meaning** is personal. Many find purpose through relationships, creativity, helping others, learning, or pursuing passions. What matters to you?';
      if (msg.includes('happiness')) return '😊 **Happiness** comes from: meaningful relationships, personal growth, gratitude, helping others, and pursuing what you love. It\'s a journey, not a destination!';
      if (msg.includes('philosophy')) return '💭 **Philosophy** explores fundamental questions about existence, knowledge, values, and reason. Great philosophers: Socrates, Plato, Aristotle, Kant!';
      return '🌟 **Deep questions** help us understand ourselves and the world. Philosophy encourages critical thinking and self-reflection!';
    }
    
    // Health & Body
    if (/\b(health|body|exercise|nutrition|diet|vitamin|muscle|brain|heart|sleep|fitness)\b/i.test(msg)) {
      if (msg.includes('exercise')) return '💪 **Exercise** strengthens muscles, improves heart health, boosts mood, and increases energy. Aim for 30+ minutes daily!';
      if (msg.includes('nutrition') || msg.includes('diet')) return '🥗 **Good nutrition**: balanced diet with fruits, vegetables, proteins, whole grains, and healthy fats. Stay hydrated with water!';
      if (msg.includes('sleep')) return '😴 **Sleep** is crucial for health! Adults need 7-9 hours. Sleep helps memory, immune system, mood, and physical recovery.';
      if (msg.includes('brain')) return '🧠 **The brain** has ~86 billion neurons! It controls everything: thoughts, movements, emotions, memories. Keep it healthy with learning and exercise!';
      return '❤️ **Health** is wealth! Good habits: exercise, nutrition, sleep, stress management, and regular check-ups keep you thriving!';
    }
    
    // Space & Astronomy
    if (/\b(space|planet|star|galaxy|universe|astronaut|nasa|mars|moon|sun|solar system|cosmos)\b/i.test(msg)) {
      if (msg.includes('planet')) return '🪐 **8 Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Jupiter is the largest, Mercury is smallest!';
      if (msg.includes('star')) return '⭐ **Stars** are giant balls of burning gas! Our Sun is a medium-sized star. The universe has trillions of stars!';
      if (msg.includes('galaxy')) return '🌌 **Galaxies** are massive systems of stars. Our Milky Way has 100-400 billion stars! The universe has ~2 trillion galaxies!';
      if (msg.includes('moon')) return '🌙 **The Moon** is Earth\'s natural satellite. It causes tides and takes 27.3 days to orbit Earth. Humans first landed there in 1969!';
      return '🚀 **Space** is infinite and mysterious! Astronomy studies celestial objects and the universe. What space topic fascinates you?';
    }
    
    // Art & Music
    if (/\b(art|paint|draw|music|song|instrument|artist|musician|dance|sculpture|gallery)\b/i.test(msg)) {
      if (msg.includes('art')) return '🎨 **Art** expresses creativity and emotion through visual mediums. Famous artists: Da Vinci, Van Gogh, Picasso, Frida Kahlo!';
      if (msg.includes('music')) return '🎵 **Music** is organized sound that evokes emotion. Elements: melody, harmony, rhythm, tempo. Every culture has unique musical traditions!';
      if (msg.includes('instrument')) return '🎸 **Musical instruments**: strings (guitar, violin), wind (flute, trumpet), percussion (drums), keyboard (piano). Each creates unique sounds!';
      return '🎭 **Arts** enrich life and culture! They include visual arts, music, dance, theater, and literature. What art form do you enjoy?';
    }
    
    // Business & Economics
    if (/\b(business|money|economy|market|trade|company|entrepreneur|invest|stock|finance|bank)\b/i.test(msg)) {
      if (msg.includes('entrepreneur')) return '💼 **Entrepreneurs** start businesses, take risks, and innovate. Famous examples: Steve Jobs, Elon Musk, Oprah Winfrey, Jeff Bezos!';
      if (msg.includes('economy')) return '📈 **Economy** is the system of production, distribution, and consumption of goods/services. It affects jobs, prices, and living standards!';
      if (msg.includes('invest')) return '💰 **Investing** means putting money into assets (stocks, bonds, real estate) to grow wealth over time. Start early, diversify, think long-term!';
      return '💵 **Business & Finance** drive modern economies. Understanding money management is crucial for financial success!';
    }
    
    // Sports
    if (/\b(sport|football|basketball|soccer|tennis|olympic|athlete|game|team|championship)\b/i.test(msg)) {
      if (msg.includes('olympic')) return '🏅 **Olympics**: Ancient Greece started it! Modern Olympics (summer & winter) unite athletes worldwide every 4 years in friendly competition!';
      if (msg.includes('sport')) return '⚽ **Sports** promote fitness, teamwork, discipline, and fun! Popular: soccer, basketball, cricket, tennis, swimming, athletics!';
      return '🏆 **Sports** teach valuable life lessons: perseverance, teamwork, handling victory and defeat. What\'s your favorite sport?';
    }
    
    // Coding context-aware responses
    if (context.task) {
      return getAIResponseOld(userMsg);
    }
    
    // General knowledge
    if (/\b(who|what|when|where|why|how|tell me|explain)\b/i.test(msg)) {
      if (msg.includes('who am i') || msg.includes('who are you')) return '🤖 I\'m your AI learning assistant created by Lister! I can help with coding, answer questions on any topic, and guide your learning journey!';
      if (msg.includes('how are you')) return '😊 I\'m doing great, thanks for asking! I\'m here and ready to help you learn anything. What would you like to explore?';
      if (msg.includes('thank')) return '🙏 You\'re welcome! I\'m happy to help. Keep asking questions - that\'s how we learn and grow!';
      return '💡 I can help with: **Science, Math, History, Geography, Technology, Languages, Philosophy, Health, Space, Arts, Business, Sports, and of course Coding!** What interests you?';
    }
    
    // Motivational & encouragement
    if (/\b(hard|difficult|can't|impossible|give up|frustrated|stuck|confused)\b/i.test(msg)) {
      return '💪 **You can do this!** Every expert was once a beginner. Challenges help you grow stronger. Take a break if needed, then try again. I believe in you! 🌟';
    }
    
    // Default comprehensive response
    return `🌟 **I'm here to help with anything!**\n\nI can answer questions about:\n• 💻 Programming & Technology\n• 🔬 Science & Math\n• 📚 History & Geography\n• 🎨 Arts & Music\n• 💼 Business & Economics\n• ⚽ Sports & Health\n• 🤔 Philosophy & Life\n• And much more!\n\nWhat would you like to learn about?`;
  };

  const getAIResponseOld = (userMsg: string): string => {
    const msg = userMsg.toLowerCase();
    const task = currentStep === 2 ? tasks[currentTask - 1] : null;
    const taskCode = task ? task.instruction.replace('Write: ', '') : '';
    const course = (activeCourse || 'coding').toLowerCase();
    
    // Greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i.test(msg.trim())) {
      return `👋 Hello! I'm your AI coding assistant, created by Lister. How can I help you learn today?`;
    }

    // Identity questions
    if (/what (are you|model|ai)|who are you|what's your name/i.test(msg)) {
      return `🤖 I'm a language model created by Lister to help you learn coding. I can explain concepts, answer questions, and guide you through lessons!`;
    }

    // Lesson about questions
    if (/what('s| is) this lesson about|what (am i|will i) learn/i.test(msg)) {
      const lessonNum = activeLesson || 1;
      const lessonName = lessonNum === 1 ? 'Introduction' : lessonNum === 2 ? 'Core Concepts' : 'Practice Project';
      return `📚 **Lesson ${lessonNum}: ${lessonName}**\n\nThis lesson teaches you ${course} fundamentals. You'll learn key concepts and practice with hands-on coding exercises. Read through the content, then click "Next Step" to continue!`;
    }

    // What to do questions
    if (/what (am i|do i|should i) (supposed to |meant to )?do|what to do|what now/i.test(msg)) {
      if (currentStep === 2 && task) {
        return `✍️ **Your task:** ${task.instruction}\n\nType this code in the editor above and click "Next" when done. Need help? Just ask for a hint!`;
      }
      return `📖 Read through the lesson content to understand the concepts. When you're ready, click the "Next Step" button to continue to the coding practice!`;
    }

    // How do I do this
    if (/how do i do this|how to do|how do i (complete|finish|solve)/i.test(msg)) {
      if (currentStep === 2 && task) {
        return `💡 **Here's how:**\n\n1. Look at the task: ${task.instruction}\n2. Type the code exactly as shown\n3. Click "Next" to check your answer\n\nThe code you need: \`${taskCode}\``;
      }
      return `Just follow along with the lesson! Read the content, understand the concepts, then click "Next Step" to move forward.`;
    }

    // Hint requests
    if (/hint|clue|tip|help me|give me (a )?hint/i.test(msg)) {
      if (currentStep === 2 && task) {
        return `💡 **Hint:** ${getHint(taskCode, getLang(course))}\n\nThe answer is: \`${taskCode}\`\n\nType it carefully in the code editor!`;
      }
      return `💡 **Hint:** Take your time reading the lesson. The concepts build on each other. Click "Next Step" when you feel ready to practice!`;
    }

    // Code knowledge base
    const codeKnowledge: Record<string, any> = {
      html: { name: 'HTML', purpose: 'structure web pages', concepts: 'HTML uses tags to define elements. Tags have opening <tag> and closing </tag>. Some tags are self-closing like <img />' },
      css: { name: 'CSS', purpose: 'style and design web pages', concepts: 'CSS uses selectors and properties. Syntax: property: value; Colors, spacing, and layouts are controlled with CSS.' },
      javascript: { name: 'JavaScript', purpose: 'add interactivity and logic', concepts: 'JavaScript is a programming language. Variables store data. Functions execute code. Use semicolons to end statements.' },
      python: { name: 'Python', purpose: 'general-purpose programming', concepts: 'Python uses indentation for code blocks. No semicolons needed. Very readable syntax. Great for beginners.' },
      react: { name: 'React', purpose: 'build user interfaces', concepts: 'React uses components. JSX combines HTML and JavaScript. Props pass data. State manages data. Hooks like useState and useEffect add functionality.' }
    };

    // Detect intent
    const intents = {
      needsHelp: /\b(help|hint|stuck|confused|lost|don't understand|idk|dunno|assist)\b/i.test(msg),
      wantsAnswer: /\b(answer|solution|show me|give me|tell me|what do i|what should i|what to)\b/i.test(msg),
      hasError: /\b(error|wrong|broken|fail|not work|issue|problem|bug|fix)\b/i.test(msg),
      explainConcept: /\b(what is|what are|explain|define|meaning|understand|learn about|tell me about)\b/i.test(msg),
      howTo: /\b(how do|how to|how can|how should)\b/i.test(msg),
      whyQuestion: /\b(why|reason|purpose)\b/i.test(msg),
      syntax: /\b(syntax|format|structure|write|code|punctuation|semicolon|bracket|quote)\b/i.test(msg),
      example: /\b(example|sample|show|demonstrate)\b/i.test(msg)
    };

    const lang = getLang(course, msg, codeKnowledge);
    const langInfo = codeKnowledge[lang];

    // Task-specific responses
    if (currentStep === 2 && task) {
      if (intents.wantsAnswer || intents.needsHelp) {
        return `💡 **Here's the solution:**\n\n\`${taskCode}\`\n\n**Explanation:** ${getLangExplanation(taskCode, lang)}\n\nCopy this into the code editor above!`;
      }
      if (intents.hasError) {
        return `🔧 **Debugging help:**\n\nThe correct code is: \`${taskCode}\`\n\n**Common mistakes:**\n• Check spacing and punctuation\n• Verify quotes and brackets match\n• Ensure semicolons are included (if needed)\n\nCompare your code carefully!`;
      }
      if (intents.syntax) {
        return `📝 **Syntax guide:**\n\n\`${taskCode}\`\n\n${getSyntaxExplanation(taskCode, lang)}`;
      }
      return `🎯 **Current task:** ${task.instruction}\n\n**Hint:** ${getHint(taskCode, lang)}\n\nNeed more help? Ask me to "show the answer" or "explain the syntax"!`;
    }

    // Concept explanation
    if (intents.explainConcept) {
      if (msg.includes('variable')) return `📦 **Variables** store data in programming.\n\n**${langInfo.name} examples:**\n${lang === 'javascript' ? '• let name = "John";\n• const age = 25;' : lang === 'python' ? '• name = "John"\n• age = 25' : '• Variables hold values you can use later'}\n\nThink of them as labeled boxes holding information!`;
      if (msg.includes('function')) return `⚙️ **Functions** are reusable blocks of code.\n\n**${langInfo.name} example:**\n${lang === 'javascript' ? 'function greet() {\n  console.log("Hello!");\n}' : lang === 'python' ? 'def greet():\n    print("Hello!")' : 'Functions execute tasks when called'}\n\nThey help organize and reuse code!`;
      if (msg.includes('loop')) return `🔄 **Loops** repeat code multiple times.\n\n**${langInfo.name} examples:**\n${lang === 'javascript' ? '• for (let i = 0; i < 5; i++) {}\n• while (condition) {}' : lang === 'python' ? '• for i in range(5):\n• while condition:' : 'Loops automate repetition'}\n\nUse them to avoid writing the same code repeatedly!`;
      if (msg.includes('array') || msg.includes('list')) return `📋 **${lang === 'python' ? 'Lists' : 'Arrays'}** store multiple values.\n\n**${langInfo.name} example:**\n${lang === 'javascript' ? 'const numbers = [1, 2, 3, 4, 5];' : lang === 'python' ? 'numbers = [1, 2, 3, 4, 5]' : 'Arrays hold ordered collections'}\n\nAccess items by index: numbers[0] gives first item!`;
      if (msg.includes('object') || msg.includes('dict')) return `🗂️ **${lang === 'python' ? 'Dictionaries' : 'Objects'}** store key-value pairs.\n\n**${langInfo.name} example:**\n${lang === 'javascript' ? 'const person = {name: "John", age: 25};' : lang === 'python' ? 'person = {"name": "John", "age": 25}' : 'Objects organize related data'}\n\nAccess values: person.name or person["name"]`;
      return `📚 **${langInfo.name}** is used to ${langInfo.purpose}.\n\n**Key concepts:** ${langInfo.concepts}\n\nWhat specific topic would you like to learn about?`;
    }

    // How-to questions
    if (intents.howTo) {
      if (msg.includes('start') || msg.includes('begin')) return `🚀 **Getting started with ${langInfo.name}:**\n\n1. Understand the basics\n2. Practice with simple examples\n3. Build small projects\n4. Learn by doing!\n\nYou're on the right track - keep going!`;
      if (msg.includes('debug') || msg.includes('fix')) return `🐛 **Debugging tips:**\n\n1. Read error messages carefully\n2. Check syntax (quotes, brackets, semicolons)\n3. Console.log() to see values\n4. Compare with working examples\n5. Take breaks and come back fresh!`;
      return `💪 **To master ${langInfo.name}:**\n\nPractice regularly, build projects, read documentation, and don't be afraid to make mistakes. Every error teaches you something!`;
    }

    // Why questions
    if (intents.whyQuestion) {
      return `🤔 **Why learn ${langInfo.name}?**\n\nIt's essential for ${langInfo.purpose}. ${langInfo.name} is widely used, has great community support, and opens many career opportunities!`;
    }

    // Example requests
    if (intents.example) {
      return `📝 **${langInfo.name} example:**\n\n${getExample(lang)}\n\nTry modifying this code to see how it works!`;
    }

    // General help
    return `👋 **I'm your AI coding tutor!**\n\nI can help you with:\n• Explaining ${langInfo.name} concepts\n• Debugging code\n• Providing examples\n• Answering "what is" and "how to" questions\n\nAsk me anything about programming!`;
  };

  const getLangExplanation = (code: string, lang: string) => {
    if (lang === 'html') return 'This HTML tag creates an element. Tags define the structure of your webpage.';
    if (lang === 'css') return 'This CSS property styles an element. Properties control appearance and layout.';
    if (lang === 'javascript') return 'This JavaScript code creates logic. It can store data, make decisions, or perform actions.';
    if (lang === 'python') return 'This Python code executes instructions. Python uses simple, readable syntax.';
    return 'This code performs a specific programming task.';
  };

  const getSyntaxExplanation = (code: string, lang: string) => {
    if (code.includes('<') && code.includes('>')) return '**HTML syntax:** <tagname>content</tagname>\n• Opening tag: <tagname>\n• Content: text or other elements\n• Closing tag: </tagname>';
    if (code.includes(':') && code.includes(';')) return '**CSS syntax:** property: value;\n• Property: what to style\n• Colon: separates property and value\n• Value: how to style it\n• Semicolon: ends the rule';
    if (code.includes('=') && lang === 'javascript') return '**JavaScript syntax:**\n• let/const: declares variables\n• = assigns values\n• ; ends statements\n• "" or \'\'  for text strings';
    if (lang === 'python') return '**Python syntax:**\n• No semicolons needed\n• Indentation matters\n• = assigns values\n• : starts code blocks';
    return 'Follow the exact syntax shown, including spacing and punctuation.';
  };

  const getHint = (code: string, lang: string) => {
    if (code.includes('<')) return 'Remember to include both opening and closing tags!';
    if (code.includes(':')) return 'Don\'t forget the colon after the property and semicolon at the end!';
    if (code.includes('=')) return 'Make sure to use the correct assignment operator and quotes for strings!';
    return 'Type the code exactly as shown, paying attention to spacing and punctuation.';
  };

  const getLang = (course: string, msg?: string, knowledge?: any) => {
    const mentionedLang = msg && knowledge ? Object.keys(knowledge).find(lang => msg.includes(lang)) : null;
    const contextLang = course.includes('html') ? 'html' : course.includes('css') ? 'css' : course.includes('javascript') || course.includes('js') ? 'javascript' : course.includes('python') ? 'python' : course.includes('react') || course.includes('mobile') ? 'react' : 'javascript';
    return mentionedLang || contextLang;
  };

  const getExample = (lang: string) => {
    const examples: Record<string, string> = {
      html: '<h1>My Title</h1>\n<p>This is a paragraph</p>\n<button>Click Me</button>',
      css: 'h1 {\n  color: blue;\n  font-size: 24px;\n}',
      javascript: 'let greeting = "Hello World";\nconsole.log(greeting);\n\nfunction add(a, b) {\n  return a + b;\n}',
      python: 'name = "Alice"\nprint(f"Hello {name}")\n\ndef greet(name):\n    return f"Hi {name}!"',
      react: 'import React, { useState } from "react";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}'
    };
    return examples[lang] || examples.javascript;
  }

  const sendRatingEmail = (rating: number, feedbackText: string, type: string) => {
    emailjs.send(
      'service_ndioh3l',
      'template_70up9ig',
      {
        title: `${type} - ${rating} Stars`,
        name: 'Wiskter User',
        email: 'noreply@wiskter.com',
        message: feedbackText || 'No additional feedback provided'
      },
      'PASLK3Vk8-e_yfFTQ'
    ).then(() => {
      console.log('Rating sent successfully');
    }).catch((error) => {
      console.error('Failed to send rating:', error);
    });
  }

  const totalTasks = skillLevel === 'learning' ? 12 : skillLevel === 'beginner' ? 8 : skillLevel === 'basics' ? 6 : 5

  const getTasksForCourse = () => {
    const courseType = activeCourse.toLowerCase();
    
    if (courseType.includes('html')) {
      if (activeLesson === 1) {
        return [
          { id: 1, instruction: 'Write: <h1>Hello World</h1>', expected: ['<h1>Hello World</h1>', '<h1>HelloWorld</h1>'] },
          { id: 2, instruction: 'Write: <p>I am learning HTML</p>', expected: ['<p>I am learning HTML</p>', '<p>IamlearningHTML</p>'] },
          { id: 3, instruction: 'Write: <div>Content</div>', expected: ['<div>Content</div>'] },
          { id: 4, instruction: 'Write: <span>Text</span>', expected: ['<span>Text</span>'] },
        ];
      } else if (activeLesson === 2) {
        return [
          { id: 1, instruction: 'Write: <a href="#">Link</a>', expected: ['<a href="#">Link</a>', '<ahref="#">Link</a>'] },
          { id: 2, instruction: 'Write: <img src="image.jpg" />', expected: ['<img src="image.jpg" />', '<imgsrc="image.jpg"/>', '<img src="image.jpg">'] },
          { id: 3, instruction: 'Write: <button>Click Me</button>', expected: ['<button>Click Me</button>', '<button>ClickMe</button>'] },
          { id: 4, instruction: 'Write: <input type="text" />', expected: ['<input type="text" />', '<inputtype="text"/>', '<input type="text">'] },
        ];
      } else {
        return [
          { id: 1, instruction: 'Write: <ul><li>Item</li></ul>', expected: ['<ul><li>Item</li></ul>'] },
          { id: 2, instruction: 'Write: <form></form>', expected: ['<form></form>'] },
          { id: 3, instruction: 'Write: <br />', expected: ['<br />', '<br/>', '<br>'] },
          { id: 4, instruction: 'Write: <hr />', expected: ['<hr />', '<hr/>', '<hr>'] },
        ];
      }
    } else if (courseType.includes('css')) {
      if (activeLesson === 1) {
        return [
          { id: 1, instruction: 'Write: color: red;', expected: ['color: red;', 'color:red;'] },
          { id: 2, instruction: 'Write: background-color: blue;', expected: ['background-color: blue;', 'background-color:blue;'] },
          { id: 3, instruction: 'Write: font-size: 16px;', expected: ['font-size: 16px;', 'font-size:16px;'] },
          { id: 4, instruction: 'Write: font-weight: bold;', expected: ['font-weight: bold;', 'font-weight:bold;'] },
        ];
      } else if (activeLesson === 2) {
        return [
          { id: 1, instruction: 'Write: margin: 10px;', expected: ['margin: 10px;', 'margin:10px;'] },
          { id: 2, instruction: 'Write: padding: 20px;', expected: ['padding: 20px;', 'padding:20px;'] },
          { id: 3, instruction: 'Write: border: 1px solid black;', expected: ['border: 1px solid black;', 'border:1px solid black;'] },
          { id: 4, instruction: 'Write: border-radius: 5px;', expected: ['border-radius: 5px;', 'border-radius:5px;'] },
        ];
      } else {
        return [
          { id: 1, instruction: 'Write: display: flex;', expected: ['display: flex;', 'display:flex;'] },
          { id: 2, instruction: 'Write: width: 100%;', expected: ['width: 100%;', 'width:100%;'] },
          { id: 3, instruction: 'Write: height: 50px;', expected: ['height: 50px;', 'height:50px;'] },
          { id: 4, instruction: 'Write: position: relative;', expected: ['position: relative;', 'position:relative;'] },
        ];
      }
    } else if (courseType.includes('javascript') || courseType.includes('js')) {
      if (activeLesson === 1) {
        return [
          { id: 1, instruction: 'Write: let name = "Student";', expected: ['let name = "Student";', "let name = 'Student';", 'let name="Student";', "let name='Student';"] },
          { id: 2, instruction: 'Write: const age = 10;', expected: ['const age = 10;', 'const age=10;'] },
          { id: 3, instruction: 'Write: let sum = 5 + 3;', expected: ['let sum = 5 + 3;', 'let sum=5+3;'] },
          { id: 4, instruction: 'Write: var isActive = true;', expected: ['var isActive = true;', 'var isActive=true;'] },
        ];
      } else if (activeLesson === 2) {
        return [
          { id: 1, instruction: 'Write: function greet() {}', expected: ['function greet() {}', 'function greet(){}'] },
          { id: 2, instruction: 'Write: if (true) {}', expected: ['if (true) {}', 'if(true){}'] },
          { id: 3, instruction: 'Write: for (let i = 0; i < 5; i++) {}', expected: ['for (let i = 0; i < 5; i++) {}', 'for(let i=0;i<5;i++){}'] },
          { id: 4, instruction: 'Write: while (false) {}', expected: ['while (false) {}', 'while(false){}'] },
        ];
      } else {
        return [
          { id: 1, instruction: 'Write: const arr = [1, 2, 3];', expected: ['const arr = [1, 2, 3];', 'const arr=[1,2,3];'] },
          { id: 2, instruction: 'Write: const obj = {key: "value"};', expected: ['const obj = {key: "value"};', 'const obj={key:"value"};', "const obj = {key: 'value'};"] },
          { id: 3, instruction: 'Write: alert("Hi");', expected: ['alert("Hi");', "alert('Hi');"] },
          { id: 4, instruction: 'Write: document.getElementById("id");', expected: ['document.getElementById("id");', "document.getElementById('id');"] },
        ];
      };
    } else if (courseType.includes('python')) {
      if (activeLesson === 1) {
        return [
          { id: 1, instruction: 'Write: name = "Student"', expected: ['name = "Student"', "name = 'Student'", 'name="Student"', "name='Student'"] },
          { id: 2, instruction: 'Write: age = 10', expected: ['age = 10', 'age=10'] },
          { id: 3, instruction: 'Write: sum = 5 + 3', expected: ['sum = 5 + 3', 'sum=5+3'] },
          { id: 4, instruction: 'Write: is_active = True', expected: ['is_active = True', 'is_active=True'] },
        ];
      } else if (activeLesson === 2) {
        return [
          { id: 1, instruction: 'Write: def greet():', expected: ['def greet():', 'defgreet():'] },
          { id: 2, instruction: 'Write: if True:', expected: ['if True:', 'ifTrue:'] },
          { id: 3, instruction: 'Write: for i in range(5):', expected: ['for i in range(5):', 'foriinrange(5):'] },
          { id: 4, instruction: 'Write: while False:', expected: ['while False:', 'whileFalse:'] },
        ];
      } else {
        return [
          { id: 1, instruction: 'Write: arr = [1, 2, 3]', expected: ['arr = [1, 2, 3]', 'arr=[1,2,3]'] },
          { id: 2, instruction: 'Write: dict = {"key": "value"}', expected: ['dict = {"key": "value"}', 'dict={"key":"value"}', "dict = {'key': 'value'}"] },
          { id: 3, instruction: 'Write: import math', expected: ['import math'] },
          { id: 4, instruction: 'Write: len([1, 2, 3])', expected: ['len([1, 2, 3])', 'len([1,2,3])'] },
        ];
      }
    } else if (courseType.includes('react') || courseType.includes('mobile') || courseType.includes('app')) {
      if (activeLesson === 1) {
        return [
          { id: 1, instruction: 'Write: import React from "react";', expected: ['import React from "react";', "import React from 'react';"] },
          { id: 2, instruction: 'Write: const App = () => {};', expected: ['const App = () => {};', 'const App=()=>{};'] },
          { id: 3, instruction: 'Write: <View></View>', expected: ['<View></View>'] },
          { id: 4, instruction: 'Write: <Text>Hello</Text>', expected: ['<Text>Hello</Text>'] },
        ];
      } else if (activeLesson === 2) {
        return [
          { id: 1, instruction: 'Write: useState(0)', expected: ['useState(0)'] },
          { id: 2, instruction: 'Write: useEffect(() => {}, [])', expected: ['useEffect(() => {}, [])', 'useEffect(()=>{},[])'] },
          { id: 3, instruction: 'Write: <Button title="Click" />', expected: ['<Button title="Click" />', '<Buttontitle="Click"/>'] },
          { id: 4, instruction: 'Write: onPress={() => {}}', expected: ['onPress={() => {}}', 'onPress={()=>{}}'] },
        ];
      } else {
        return [
          { id: 1, instruction: 'Write: style={{flex: 1}}', expected: ['style={{flex: 1}}', 'style={{flex:1}}'] },
          { id: 2, instruction: 'Write: export default App;', expected: ['export default App;'] },
          { id: 3, instruction: 'Write: <TouchableOpacity></TouchableOpacity>', expected: ['<TouchableOpacity></TouchableOpacity>'] },
          { id: 4, instruction: 'Write: <ScrollView></ScrollView>', expected: ['<ScrollView></ScrollView>'] },
        ];
      }
    }
    
    // Default tasks
    return [
      { id: 1, instruction: 'Write: let name = "Student";', expected: ['let name = "Student";', "let name = 'Student';"] },
      { id: 2, instruction: 'Write: const age = 10;', expected: ['const age = 10;', 'const age=10;'] },
      { id: 3, instruction: 'Write: let sum = 5 + 3;', expected: ['let sum = 5 + 3;', 'let sum=5+3;'] },
      { id: 4, instruction: 'Write: function greet() {}', expected: ['function greet() {}', 'function greet(){}'] },
    ];
  };

  const tasks = getTasksForCourse()

  const navItems = [
    { name: 'About', onClick: () => setShowAbout(true), icon: Info },
    { name: 'Settings', onClick: () => setShowSettings(true), icon: Settings },
  ]



  const getCourseTitle = (base: string) => {
    if (skillLevel === 'learning') return base === 'HTML Basics' ? 'HTML Basics' : base === 'CSS Styling' ? 'CSS Intro' : base === 'JavaScript' ? 'JavaScript Start' : base
    if (skillLevel === 'basics') return base === 'HTML Basics' ? 'Advanced HTML' : base === 'CSS Styling' ? 'Advanced CSS' : base === 'JavaScript' ? 'Modern JavaScript' : base === 'Python' ? 'Advanced Python' : base
    if (skillLevel === 'expert') return base === 'HTML Basics' ? 'Web Performance' : base === 'CSS Styling' ? 'CSS Architecture' : base === 'JavaScript' ? 'Advanced JS' : base === 'Python' ? 'Python Mastery' : base
    return base
  }

  const handleQuit = (action: () => void) => {
    if (activeLesson > 0 && currentStep > 0 && currentStep < 3) {
      setQuitAction(() => action);
      setShowQuitDialog(true);
    } else {
      action();
    }
  };

  const sidebarLinks = learningPath === 'websites' ? [
    { label: 'Home', onClick: () => handleQuit(() => { setActiveCourse(''); setShowFreeWill(false); }), icon: <Home className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('HTML Basics'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('HTML Basics')); setShowFreeWill(false); }), icon: <Code className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('CSS Styling'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('CSS Styling')); setShowFreeWill(false); }), icon: <Palette className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('JavaScript'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('JavaScript')); setShowFreeWill(false); }), icon: <Zap className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: 'Free Will', onClick: () => { setShowFreeWill(true); setActiveCourse(''); }, icon: <FileCode className="text-white h-5 w-5 flex-shrink-0" /> },
  ] : learningPath === 'mobile-apps' ? [
    { label: 'Home', onClick: () => handleQuit(() => { setActiveCourse(''); setShowFreeWill(false); }), icon: <Home className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: skillLevel === 'learning' ? 'Mobile Intro' : skillLevel === 'basics' ? 'Advanced React Native' : skillLevel === 'expert' ? 'Mobile Architecture' : 'React Native', onClick: () => handleQuit(() => { setActiveCourse(skillLevel === 'learning' ? 'Mobile Intro' : skillLevel === 'basics' ? 'Advanced React Native' : skillLevel === 'expert' ? 'Mobile Architecture' : 'React Native'); setShowFreeWill(false); }), icon: <Code className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: skillLevel === 'learning' ? 'App.js Start' : skillLevel === 'basics' ? 'State Management' : skillLevel === 'expert' ? 'Performance Optimization' : 'App.js Basics', onClick: () => handleQuit(() => { setActiveCourse(skillLevel === 'learning' ? 'App.js Start' : skillLevel === 'basics' ? 'State Management' : skillLevel === 'expert' ? 'Performance Optimization' : 'App.js Basics'); setShowFreeWill(false); }), icon: <FileCode className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: skillLevel === 'learning' ? 'Basic Tools' : skillLevel === 'basics' ? 'Advanced Tools' : skillLevel === 'expert' ? 'Enterprise Tools' : 'Mobile Tools', onClick: () => handleQuit(() => { setActiveCourse(skillLevel === 'learning' ? 'Basic Tools' : skillLevel === 'basics' ? 'Advanced Tools' : skillLevel === 'expert' ? 'Enterprise Tools' : 'Mobile Tools'); setShowFreeWill(false); }), icon: <Zap className="text-white h-5 w-5 flex-shrink-0" /> },
  ] : [
    { label: 'Home', onClick: () => handleQuit(() => { setActiveCourse(''); setShowFreeWill(false); }), icon: <Home className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('HTML Basics'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('HTML Basics')); setShowFreeWill(false); }), icon: <Code className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('CSS Styling'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('CSS Styling')); setShowFreeWill(false); }), icon: <Palette className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('JavaScript'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('JavaScript')); setShowFreeWill(false); }), icon: <Zap className="text-white h-5 w-5 flex-shrink-0" /> },
    { label: getCourseTitle('Python'), onClick: () => handleQuit(() => { setActiveCourse(getCourseTitle('Python')); setShowFreeWill(false); }), icon: <FileCode className="text-white h-5 w-5 flex-shrink-0" /> },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {showWelcome ? (
        <div className={`fixed inset-0 z-50 flex items-center justify-center animate-fade-in ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }`}>
          <div className="text-center space-y-8 animate-in">
            <div className="flex justify-center mb-6">
              <AnimatedGradientText className="px-6 py-2">
                <span className={cn(`inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent font-semibold`)}>
                  {t('startJourney', language)}
                </span>
                <ChevronRight className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </div>
            
            <div className="text-7xl font-bold mb-4 animate-pulse">&lt;/&gt;</div>
            <h1 className="text-5xl font-bold">{t('welcome', language)} <span className="text-white">Wiskter</span></h1>
            <p className="text-xl text-gray-400 mb-8">{t('learnCoding', language)}</p>
            
            <div className="max-w-md mx-auto space-y-4">
              <Label htmlFor="language-select" className="text-white text-lg">Choose your language / Elige tu idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select" className="h-12 text-base">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="et">Eesti</SelectItem>
                </SelectContent>
              </Select>
              
              <Label htmlFor="skill-level" className="text-white text-lg">{t('skillLevel', language)}</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger id="skill-level" className="h-12 text-base">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learning">{t('learningCoding', language)}</SelectItem>
                  <SelectItem value="beginner">{t('beginner', language)}</SelectItem>
                  <SelectItem value="basics">{t('knowsBasics', language)}</SelectItem>
                  <SelectItem value="expert">{t('expert', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <button 
              onClick={() => {
                setShowWelcome(false)
                setShowGoalScreen(true)
              }}
              disabled={!skillLevel}
              className={`mt-8 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                theme === 'dark' 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {t('continue', language)}
            </button>
            
            {!isLoggedIn && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-gray-400 mb-4">{t('wantSaveProgress', language)}</p>
                <button 
                  onClick={() => setShowAuth(true)}
                  className={`px-6 py-2 border-2 rounded-full font-semibold transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-black/20 text-black hover:bg-black/10'
                  }`}
                >
                  {t('signIn', language)}
                </button>
              </div>
            )}
            {isLoggedIn && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-green-400 mb-2 flex items-center justify-center gap-2">
                  <span className="text-xl">✓</span> {t('signedInSuccess', language)}
                </p>
                <p className="text-gray-400 text-sm">{t('progressWillBeSaved', language)}</p>
              </div>
            )}
          </div>
        </div>
      ) : showGoalScreen ? (
        <div className={`fixed inset-0 z-50 flex items-center justify-center animate-fade-in ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }`}>
          <div className="text-center space-y-8 animate-in max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{t('whatDevelop', language)}</h1>
            <p className="text-lg md:text-xl text-gray-400">{t('choosePath', language)}</p>
            
            <div className="max-w-md mx-auto space-y-4">
              <Label htmlFor="dev-goal" className="text-white text-lg">{t('selectGoal', language)}</Label>
              <Select value={developmentGoal} onValueChange={setDevelopmentGoal}>
                <SelectTrigger id="dev-goal" className="h-12 text-base">
                  <SelectValue placeholder="What do you want to build?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="websites">{t('websites', language)}</SelectItem>
                  <SelectItem value="mobile-apps">{t('mobileApps', language)}</SelectItem>
                  <SelectItem value="web-apps">{t('webApps', language)}</SelectItem>
                  <SelectItem value="other">{t('other', language)}</SelectItem>
                </SelectContent>
              </Select>
              
              {developmentGoal === 'other' && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="custom-goal" className="text-white">Tell us what you want to develop</Label>
                  <input
                    id="custom-goal"
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g., Games, Desktop Apps, AI Tools..."
                    className="w-full h-12 px-4 rounded-lg border border-white/20 bg-black text-white placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setShowWelcome(true)
                  setShowGoalScreen(false)
                }}
                className={`px-6 py-3 border-2 rounded-full font-bold transition-all ${
                  theme === 'dark'
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-black/20 text-black hover:bg-black/10'
                }`}
              >
                {t('back', language)}
              </button>
              <button 
                onClick={() => {
                  setLearningPath(developmentGoal)
                  setShowGoalScreen(false)
                }}
                disabled={!developmentGoal || (developmentGoal === 'other' && !customGoal)}
                className={`px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {t('startLearning', language)}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full animate-fade-in">
          <div className="hidden md:block">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
              <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                  {sidebarOpen ? (
                    <div className="font-bold flex items-center gap-2 text-white py-1">
                      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Wiskter</motion.span>
                    </div>
                  ) : (
                    <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
                  )}
                  <div className="mt-8 flex flex-col gap-2">
                    {sidebarLinks.map((link, idx) => (
                      <SidebarLink key={idx} link={link} />
                    ))}
                  </div>
                </div>
              </SidebarBody>
            </Sidebar>
          </div>
          
          <div className="flex-1 overflow-y-auto">
          <nav className={`sticky top-0 z-40 backdrop-blur-sm border-b px-4 md:px-8 py-3 md:py-4 ${
            theme === 'dark'
              ? 'bg-black/95 border-white/10'
              : 'bg-white/95 border-black/10'
          }`}>
            <div className="flex justify-between items-center">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
              >
                <div className="space-y-1.5">
                  <div className={`w-5 h-0.5 ${
                    theme === 'dark' ? 'bg-white' : 'bg-black'
                  }`}></div>
                  <div className={`w-5 h-0.5 ${
                    theme === 'dark' ? 'bg-white' : 'bg-black'
                  }`}></div>
                  <div className={`w-5 h-0.5 ${
                    theme === 'dark' ? 'bg-white' : 'bg-black'
                  }`}></div>
                </div>
              </button>

              {/* Logo */}
              <div className="text-lg md:text-xl font-bold">&lt;Wiskter/&gt;</div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <InteractiveHoverButton 
                  text="What's new?"
                  onClick={() => setShowWhatsNew(true)}
                  className="w-auto px-4 bg-white text-black hover:bg-gray-100"
                />
                <ul className="flex gap-8 items-center">
                  <li><a href="#home" className="hover:text-gray-400 transition">{t('home', language)}</a></li>
                  <li><a href="#courses" className="hover:text-gray-400 transition">{t('courses', language)}</a></li>
                  <li><button onClick={() => setShowFAQ(true)} className="hover:text-gray-400 transition">FAQ</button></li>
                  <li><button onClick={() => setShowAbout(true)} className="hover:text-gray-400 transition">{t('about', language)}</button></li>
                  <li><button onClick={() => setShowSettings(true)} className="hover:text-gray-400 transition">{t('settings', language)}</button></li>
                </ul>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden flex items-center gap-2">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowAbout(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </nav>

          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`md:hidden fixed inset-0 z-50 backdrop-blur-sm ${
                theme === 'dark' ? 'bg-black/95' : 'bg-white/95'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="p-6 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xl font-bold">&lt;Wiskter/&gt;</div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-3xl hover:bg-white/10 rounded-lg w-10 h-10 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-3">
                  {sidebarLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        link.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg transition active:scale-95 ${
                        theme === 'dark'
                          ? 'bg-white/5 hover:bg-white/10 active:bg-white/15'
                          : 'bg-black/5 hover:bg-black/10 active:bg-black/15'
                      }`}
                    >
                      {link.icon}
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeCourse ? (
            activeLesson > 0 ? (
              <section className="py-4 md:py-16 px-4 md:px-8 pb-20 md:pb-8 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  <button onClick={() => handleQuit(() => { setActiveLesson(0); setCurrentStep(0); })} className="mb-4 md:mb-6 text-gray-400 hover:text-white transition flex items-center gap-2 text-sm md:text-base">
                    ← Back to Lessons
                  </button>
                  <div className="mb-4 md:mb-6">
                    <div className="flex gap-1 md:gap-2 mb-2">
                      {Array.from({ length: totalTasks }).map((_, i) => (
                        <div key={i} className={`h-1.5 md:h-2 flex-1 rounded-full transition-all duration-500 ${currentTask > i + 1 ? 'bg-green-500' : currentTask === i + 1 ? 'bg-white' : 'bg-white/20'}`} />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400">Task {currentTask} of {totalTasks}</p>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`border-2 rounded-2xl p-4 md:p-8 ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[#333]'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h1 className="text-3xl font-bold mb-4">Lesson {activeLesson}: {activeLesson === 1 ? 'Introduction' : activeLesson === 2 ? 'Core Concepts' : 'Practice Project'}</h1>
                    {showChatbot && activeLesson > 0 && (
                      <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed bottom-4 right-4 w-80 bg-[#111] border-2 border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">🤖</span>
                            <span className="font-bold">AI Helper</span>
                          </div>
                          <button onClick={() => setShowChatbot(false)} className="text-2xl hover:scale-110 transition">&times;</button>
                        </div>
                        <div className="h-64 overflow-y-auto p-4 space-y-3">
                          {chatMessages.length === 0 && (
                            <div className="text-gray-400 text-sm text-center py-8">
                              Hi! Need a hint? Ask me anything! 💡
                            </div>
                          )}
                          {chatMessages.map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot ? 'bg-white/10' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                                {msg.text}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-white/20">
                          <div className="flex gap-2">
                            <input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={async (e) => {
                                if (e.key === 'Enter' && chatInput.trim()) {
                                  const userMsg = chatInput.trim();
                                  setChatMessages([...chatMessages, { text: userMsg, isBot: false }]);
                                  setChatInput('');
                                  setChatMessages(prev => [...prev, { text: '🤔 Thinking...', isBot: true }]);
                                  const response = await getAIResponse(userMsg);
                                  setChatMessages(prev => [...prev.slice(0, -1), { text: response, isBot: true }]);
                                }
                              }}
                              placeholder="Ask for a hint..."
                              className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                            />
                            <button
                              onClick={async () => {
                                if (chatInput.trim()) {
                                  const userMsg = chatInput.trim();
                                  setChatMessages([...chatMessages, { text: userMsg, isBot: false }]);
                                  setChatInput('');
                                  setChatMessages(prev => [...prev, { text: '🤔 Thinking...', isBot: true }]);
                                  const response = await getAIResponse(userMsg);
                                  setChatMessages(prev => [...prev.slice(0, -1), { text: response, isBot: true }]);
                                }
                              }}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-bold hover:opacity-80 transition text-sm"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {currentStep === 0 && (
                      <div className="space-y-4 md:space-y-6">
                        <p className={`text-sm md:text-base ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Welcome to this lesson! Let's get started with the basics.</p>
                        <div className={`border rounded-lg p-4 md:p-6 ${
                          theme === 'dark'
                            ? 'bg-black border-white/20'
                            : 'bg-white border-black/20'
                        }`}>
                          <h3 className="font-bold mb-3 text-sm md:text-base">What you'll learn:</h3>
                          <ul className={`space-y-2 text-sm md:text-base ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <li>✓ Understanding the fundamentals</li>
                            <li>✓ Hands-on practice</li>
                            <li>✓ Real-world examples</li>
                          </ul>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setCurrentStep(1)} className={`flex-1 py-3 rounded-lg font-bold transition-all hover:scale-105 text-sm md:text-base ${
                            theme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}>
                            Start Learning
                          </button>
                          <button onClick={() => setShowChatbot(!showChatbot)} className="py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-80 transition text-sm md:text-base">
                            🤖 Help
                          </button>
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="space-y-4 md:space-y-6">
                        <p className={`text-sm md:text-base ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Let's dive into the core concepts and understand how everything works.</p>
                        <div className={`border rounded-lg p-4 md:p-6 ${
                          theme === 'dark'
                            ? 'bg-black border-white/20'
                            : 'bg-white border-black/20'
                        }`}>
                          <h3 className="font-bold mb-3 text-sm md:text-base">Key Concept:</h3>
                          <p className={`mb-4 text-sm md:text-base ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>This is where you learn the main ideas and principles.</p>
                          <div className={`border rounded p-3 md:p-4 font-mono text-xs md:text-sm overflow-x-auto ${
                            theme === 'dark'
                              ? 'bg-[#111] border-white/10 text-green-400'
                              : 'bg-gray-100 border-black/10 text-green-600'
                          }`}>
                            // Example code here
                            <br />console.log("Hello, World!");
                          </div>
                        </div>
                        <div className="flex gap-3 md:gap-4">
                          <button onClick={() => setCurrentStep(0)} className={`flex-1 py-2.5 md:py-3 border-2 rounded-lg font-bold transition text-sm md:text-base ${
                            theme === 'dark'
                              ? 'border-white/20 text-white hover:bg-white/10'
                              : 'border-black/20 text-black hover:bg-black/10'
                          }`}>
                            Previous
                          </button>
                          <button onClick={() => setShowChatbot(!showChatbot)} className="py-2.5 md:py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-80 transition text-sm md:text-base">
                            🤖 Help
                          </button>
                          <button onClick={() => setCurrentStep(2)} className={`flex-1 py-2.5 md:py-3 rounded-lg font-bold transition-all hover:scale-105 text-sm md:text-base ${
                            theme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}>
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        {showMiniRobot && (

                          <motion.div
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ 
                              x: 0, 
                              opacity: 1,
                              transition: { duration: 0.6, ease: "easeOut" }
                            }}
                            exit={{ 
                              x: 200, 
                              opacity: 0,
                              transition: { duration: 0.6, ease: "easeIn" }
                            }}
                            className="fixed bottom-10 right-10 z-40"
                          >
                            <div className="bg-green-500 rounded-full p-4 shadow-2xl">
                              <motion.div
                                animate={{ rotate: [0, 20, 0] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="text-5xl"
                              >
                                🤖👍
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                        {showCelebration && (
                          <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowCelebration(false)}
                          >
                            <div className="text-center">
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, -10, 0]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                                className="text-9xl mb-4"
                              >
                                🎉
                              </motion.div>
                              <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                              >
                                Awesome!
                              </motion.h2>
                              <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl text-gray-300 mb-8"
                              >
                                You got it right! Keep going!
                              </motion.p>
                              <motion.div
                                initial={{ scale: 0, x: 100 }}
                                animate={{ scale: 1, x: 0 }}
                                transition={{ delay: 0.7, type: "spring" }}
                                className="fixed bottom-10 right-10"
                              >
                                <div className="relative">
                                  <motion.div
                                    animate={{ rotate: [0, 15, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-8xl"
                                  >
                                    🤖
                                  </motion.div>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.5, 1] }}
                                    transition={{ delay: 0.9 }}
                                    className="absolute -top-4 -right-4 text-6xl"
                                  >
                                    👍
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                        <p className={`text-sm md:text-base ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Great job! Now let's practice what you've learned.</p>
                        <div className={`border rounded-lg p-4 md:p-6 ${
                          theme === 'dark'
                            ? 'bg-black border-white/20'
                            : 'bg-white border-black/20'
                        }`}>
                          <h3 className="font-bold mb-3 text-sm md:text-base">Task {currentTask}:</h3>
                          <p className={`mb-4 text-sm md:text-base ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{tasks[currentTask - 1]?.instruction}</p>
                          <textarea 
                            value={userCode}
                            onChange={(e) => { setUserCode(e.target.value); setCodeError(''); }}
                            className={`w-full h-32 md:h-40 border rounded p-3 md:p-4 font-mono text-xs md:text-sm resize-none ${
                              theme === 'dark'
                                ? 'bg-[#111] border-white/10 text-white placeholder:text-gray-400'
                                : 'bg-gray-50 border-black/10 text-black placeholder:text-gray-600'
                            }`}
                            placeholder="Write your code here..."
                          />

                          {codeError && (
                            <p className="text-red-400 text-xs md:text-sm mt-2 animate-fade-in">{codeError}</p>
                          )}

                          {codeOutput && (
                            <div className="mt-4 animate-fade-in">
                              <h4 className="text-xs md:text-sm font-bold text-green-400 mb-2">Output:</h4>
                              <div className="bg-white border border-green-500/30 rounded p-3 min-h-[60px] overflow-auto">
                                {codeOutput.type === 'html' ? (
                                  <iframe
                                    srcDoc={`<!DOCTYPE html><html><head><style>body{font-family:Arial;margin:10px;color:#333;}</style></head><body>${codeOutput.content}</body></html>`}
                                    className="w-full h-16 border-0"
                                    sandbox="allow-scripts"
                                  />
                                ) : codeOutput.type === 'css' ? (
                                  <iframe
                                    srcDoc={`<!DOCTYPE html><html><head><style>.demo{${codeOutput.content} padding:15px; margin:10px; background:#f0f0f0; border:1px solid #ddd;}</style></head><body><div class='demo'>Sample Text</div></body></html>`}
                                    className="w-full h-16 border-0"
                                  />
                                ) : (
                                  <div className="text-black font-mono text-sm p-2">{codeOutput.content}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 md:gap-4">
                          <button onClick={() => { if (currentTask > 1) { setCurrentTask(currentTask - 1); setUserCode(''); setCodeError(''); setChatMessages([]); } else { setCurrentStep(1); setChatMessages([]); } }} className={`flex-1 py-2.5 md:py-3 border-2 rounded-lg font-bold transition text-sm md:text-base ${
                            theme === 'dark'
                              ? 'border-white/20 text-white hover:bg-white/10'
                              : 'border-black/20 text-black hover:bg-black/10'
                          }`}>
                            Previous
                          </button>
                          <button onClick={() => setShowChatbot(!showChatbot)} className="py-2.5 md:py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-80 transition text-sm md:text-base">
                            🤖 Hint
                          </button>
                          <button onClick={() => {
                            const cleanCode = userCode.trim().replace(/\s+/g, '');
                            const task = tasks[currentTask - 1];
                            const isCorrect = task.expected.some(exp => cleanCode === exp.replace(/\s+/g, ''));
                            
                            if (!userCode.trim()) {
                              setCodeError('Please write some code before continuing.');
                            } else {
                              // Execute code and show output
                              const code = userCode.trim();
                              let output = null;
                              
                              if (code.includes('<')) {
                                output = { type: 'html', content: code };
                              } else if (code.includes('console.log')) {
                                const match = code.match(/console\.log\((.+?)\);?/);
                                output = { type: 'text', content: match ? match[1].replace(/["']/g, '') : 'No output' };
                              } else if (code.includes('print')) {
                                const match = code.match(/print\((.+?)\)/);
                                output = { type: 'text', content: match ? match[1].replace(/["']/g, '') : 'No output' };
                              } else if (code.includes(':')) {
                                output = { type: 'css', content: code };
                              }
                              
                              setCodeOutput(output);
                              
                              if (isCorrect) {


                              if (currentTask < totalTasks) {
                                setShowMiniRobot(true);
                                setTimeout(() => {
                                  setShowMiniRobot(false);
                                  setCurrentTask(currentTask + 1);
                                  setUserCode('');
                                  setCodeError('');
                                  setCodeOutput(null);
                                }, 1500);
                              } else {
                                setShowCelebration(true);
                                setTimeout(() => {
                                  setShowCelebration(false);
                                  setCurrentStep(3);
                                  setShowRating(true);
                                }, 3000);
                              }
                              } else {
                                setCodeError(`Not quite right. Try: ${task.instruction.replace('Write: ', '')}`);
                              }
                            }
                          }} className={`flex-1 py-2.5 md:py-3 rounded-lg font-bold transition-all hover:scale-105 text-sm md:text-base ${
                              theme === 'dark'
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}>
                            {currentTask < totalTasks ? 'Next' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-4 md:space-y-6 text-center">
                        <div className="text-5xl md:text-6xl mb-4 animate-bounce">🎉</div>
                        <h2 className="text-2xl md:text-3xl font-bold">Lesson {activeLesson} Complete!</h2>
                        <div className="inline-block bg-green-500/20 border-2 border-green-500 rounded-full px-4 md:px-6 py-1.5 md:py-2 mb-4">
                          <span className="text-green-400 font-bold text-sm md:text-base">✓ COMPLETED</span>
                        </div>
                        <p className="text-sm md:text-base text-gray-400">Congratulations! You've completed this lesson.</p>
                        <div className="flex gap-3 md:gap-4">
                          <button onClick={() => { 
                            setActiveLesson(activeLesson);
                            setCurrentStep(0);
                            setCurrentTask(1);
                            setUserCode('');
                            setCodeError('');
                            setCodeOutput(null);
                          }} className={`flex-1 py-2.5 md:py-3 border-2 rounded-lg font-bold transition-all hover:scale-105 text-sm md:text-base ${
                            theme === 'dark'
                              ? 'border-white/20 text-white hover:bg-white/10'
                              : 'border-black/20 text-black hover:bg-black/10'
                          }`}>
                            Try Again
                          </button>
                          <button onClick={() => { 
                            if (!completedLessons.includes(activeLesson)) {
                              setCompletedLessons([...completedLessons, activeLesson]);
                            }
                            setActiveLesson(0); 
                            setCurrentStep(0);
                            setCurrentTask(1);
                            setUserCode('');
                            setCodeError('');
                            setCodeOutput(null);
                          }} className={`flex-1 py-2.5 md:py-3 rounded-lg font-bold transition-all hover:scale-105 text-sm md:text-base ${
                            theme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}>
                            Back to Course
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </section>
            ) : (
              <section className="py-8 md:py-16 px-4 md:px-8 pb-20 md:pb-8 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  <button onClick={() => handleQuit(() => setActiveCourse(''))} className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2">
                    {t('backToCourses', language)}
                  </button>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{activeCourse}</h1>
                  <div className={`border-2 rounded-2xl p-8 mb-8 ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[#333]'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h2 className="text-2xl font-bold mb-4">{t('courseContent', language)}</h2>
                    <p className={`mb-6 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('startLearningWith', language)} {activeCourse} {t('interactiveLessons', language)}.</p>
                    <div className="space-y-4">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} onClick={() => handleQuit(() => setActiveLesson(1))} className={`border rounded-lg p-4 hover:scale-105 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-black border-white/20 hover:border-white'
                          : 'bg-white border-black/20 hover:border-black'
                      }`}>
                        <h3 className="font-bold mb-2">{t('lesson', language)} 1: {t('introduction', language)}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{t('getStartedBasics', language)}</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} onClick={() => handleQuit(() => setActiveLesson(2))} className={`border rounded-lg p-4 hover:scale-105 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-black border-white/20 hover:border-white'
                          : 'bg-white border-black/20 hover:border-black'
                      }`}>
                        <h3 className="font-bold mb-2">{t('lesson', language)} 2: {t('coreConcepts', language)}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{t('learnFundamental', language)}</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} onClick={() => handleQuit(() => setActiveLesson(3))} className={`border rounded-lg p-4 hover:scale-105 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-black border-white/20 hover:border-white'
                          : 'bg-white border-black/20 hover:border-black'
                      }`}>
                        <h3 className="font-bold mb-2">{t('lesson', language)} 3: {t('practiceProject', language)}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{t('buildSomethingReal', language)}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>
            )
          ) : showFreeWill ? (
            <section className="py-4 md:py-8 px-4 md:px-8 pb-20 md:pb-8 animate-fade-in h-full">
              <div className="max-w-7xl mx-auto h-full flex flex-col">
                {typeof window !== 'undefined' && (() => {
                  const handleMessage = (e: MessageEvent) => {
                    if (e.data.type === 'console') {
                      const prefix = e.data.level === 'error' ? '[ERROR]' : e.data.level === 'warn' ? '[WARN]' : '[LOG]';
                      setConsoleOutput(prev => [...prev, `${prefix} ${e.data.message}`]);
                    }
                  };
                  window.removeEventListener('message', handleMessage);
                  window.addEventListener('message', handleMessage);
                  return null;
                })()}
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setShowFreeWill(false)} className="text-gray-400 hover:text-white transition flex items-center gap-2">
                    ← Back
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold">Free Will Playground</h1>
                  <button onClick={() => setShowTerminal(true)} className={`px-4 py-2 rounded-lg font-semibold transition ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-black'
                  }`}>
                    💻 Terminal
                  </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
                  <div className={`flex flex-col border-2 rounded-2xl overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[#333]'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`flex border-b ${
                      theme === 'dark' ? 'border-white/20' : 'border-black/20'
                    }`}>
                      <button
                        onClick={() => setActiveFile('html')}
                        className={`flex-1 py-3 px-4 font-semibold transition ${
                          activeFile === 'html'
                            ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                            : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        index.html
                      </button>
                      <button
                        onClick={() => setActiveFile('css')}
                        className={`flex-1 py-3 px-4 font-semibold transition ${
                          activeFile === 'css'
                            ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                            : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        style.css
                      </button>
                      <button
                        onClick={() => setActiveFile('js')}
                        className={`flex-1 py-3 px-4 font-semibold transition ${
                          activeFile === 'js'
                            ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                            : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        script.js
                      </button>
                    </div>
                    <div className="flex-1 p-4 overflow-hidden">
                      <textarea
                        value={freeWillFiles[activeFile]}
                        onChange={(e) => setFreeWillFiles({ ...freeWillFiles, [activeFile]: e.target.value })}
                        className={`w-full h-full border rounded p-4 font-mono text-sm resize-none focus:outline-none ${
                          theme === 'dark'
                            ? 'bg-black border-white/10 text-white focus:border-white'
                            : 'bg-white border-black/10 text-black focus:border-black'
                        }`}
                        placeholder={`Write your ${activeFile === 'html' ? 'HTML' : activeFile === 'css' ? 'CSS' : 'JavaScript'} code here...`}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                  
                  <div className={`flex flex-col border-2 rounded-2xl overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-[#111] border-[#333]'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`py-3 px-4 border-b font-semibold ${
                      theme === 'dark' ? 'border-white/20' : 'border-black/20'
                    }`}>
                      Preview
                    </div>
                    <div className="flex-1 bg-white overflow-auto">
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>${freeWillFiles.css}</style>
                            </head>
                            <body>
                              ${freeWillFiles.html}
                              <script>
                                const originalLog = console.log;
                                const originalError = console.error;
                                const originalWarn = console.warn;
                                
                                console.log = function(...args) {
                                  window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
                                  originalLog.apply(console, args);
                                };
                                console.error = function(...args) {
                                  window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
                                  originalError.apply(console, args);
                                };
                                console.warn = function(...args) {
                                  window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
                                  originalWarn.apply(console, args);
                                };
                                
                                try {
                                  ${freeWillFiles.js}
                                } catch(e) {
                                  console.error('Error: ' + e.message);
                                  document.body.innerHTML += '<div style="color: red; padding: 20px; background: #fee; margin: 10px; border: 2px solid red; border-radius: 5px;"><strong>Error:</strong> ' + e.message + '</div>';
                                }
                              </script>
                            </body>
                          </html>
                        `}
                        className="w-full h-full border-0"
                        title="Preview"
                        sandbox="allow-scripts"
                      />
                    </div>
                    <div className={`border-t h-32 overflow-y-auto ${
                      theme === 'dark'
                        ? 'bg-black border-white/20'
                        : 'bg-gray-900 border-black/20'
                    }`}>
                      <div className="px-3 py-2 border-b border-white/10 text-xs font-semibold text-gray-400 flex justify-between items-center">
                        <span>Console</span>
                        <button onClick={() => setConsoleOutput([])} className="text-xs hover:text-white transition">Clear</button>
                      </div>
                      <div className="p-2 font-mono text-xs space-y-1">
                        {consoleOutput.length === 0 ? (
                          <div className="text-gray-500">Console output will appear here...</div>
                        ) : (
                          consoleOutput.map((log, i) => (
                            <div key={i} className={`${
                              log.startsWith('[ERROR]') ? 'text-red-400' :
                              log.startsWith('[WARN]') ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>{log}</div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                  <p>💡 Tip: Edit your HTML, CSS, and JavaScript files. The preview updates automatically!</p>
                </div>
                
                <button
                  onClick={() => setShowFreeWillChat(!showFreeWillChat)}
                  className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
                >
                  <span className="text-2xl">🤖</span>
                </button>
                
                {showFreeWillChat && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    className="fixed bottom-24 right-6 w-96 bg-[#111] border-2 border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">🤖</span>
                        <span className="font-bold">AI Assistant</span>
                      </div>
                      <button onClick={() => setShowFreeWillChat(false)} className="text-2xl hover:scale-110 transition">&times;</button>
                    </div>
                    <div className="h-96 overflow-y-auto p-4 space-y-3">
                      {freeWillChatMessages.length === 0 && (
                        <div className="text-gray-400 text-sm text-center py-8">
                          Hi! I can help you with HTML, CSS, and JavaScript! Ask me anything! 💡
                        </div>
                      )}
                      {freeWillChatMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot ? 'bg-white/10' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-white/20">
                      <div className="flex gap-2">
                        <input
                          value={freeWillChatInput}
                          onChange={(e) => setFreeWillChatInput(e.target.value)}
                          onKeyPress={async (e) => {
                            if (e.key === 'Enter' && freeWillChatInput.trim()) {
                              const userMsg = freeWillChatInput.trim();
                              setFreeWillChatMessages([...freeWillChatMessages, { text: userMsg, isBot: false }]);
                              setFreeWillChatInput('');
                              setFreeWillChatMessages(prev => [...prev, { text: '🤔 Thinking...', isBot: true }]);
                              const response = await getAIResponse(userMsg);
                              setFreeWillChatMessages(prev => [...prev.slice(0, -1), { text: response, isBot: true }]);
                            }
                          }}
                          placeholder="Ask about your code..."
                          className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                        />
                        <button
                          onClick={async () => {
                            if (freeWillChatInput.trim()) {
                              const userMsg = freeWillChatInput.trim();
                              setFreeWillChatMessages([...freeWillChatMessages, { text: userMsg, isBot: false }]);
                              setFreeWillChatInput('');
                              setFreeWillChatMessages(prev => [...prev, { text: '🤔 Thinking...', isBot: true }]);
                              const response = await getAIResponse(userMsg);
                              setFreeWillChatMessages(prev => [...prev.slice(0, -1), { text: response, isBot: true }]);
                            }
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-bold hover:opacity-80 transition text-sm"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          ) : (
            <>
          <section className="py-12 md:py-24 px-4 md:px-8 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <IconCloud iconSlugs={['html5', 'css3', 'javascript', 'typescript', 'react', 'python', 'java', 'git', 'github', 'visualstudiocode', 'nodejs', 'npm']} />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('learnTo', language)} <span className="text-white">{t('code', language)}</span></h1>
              <p className="text-lg md:text-xl text-gray-400">{t('masterProgramming', language)}</p>
            </div>
          </section>

          <section id="courses" className="py-8 md:py-16 px-4 md:px-8 pb-20 md:pb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
              {learningPath === 'websites' ? 'Website Development Path' : 
               learningPath === 'mobile-apps' ? 'Mobile App Development Path' : 
               t('choosePath2', language)} - {skillLevel === 'learning' ? 'Learning' : skillLevel === 'beginner' ? 'Beginner' : skillLevel === 'basics' ? 'Intermediate' : 'Expert'} Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {(learningPath === 'websites' ? (
                skillLevel === 'learning' ? [
                  { icon: '🌐', title: 'HTML Basics', desc: 'Learn the structure of web pages', topics: ['What is HTML?', 'Your First Tag', 'Basic Structure'] },
                  { icon: '🎨', title: 'CSS Intro', desc: 'Make things colorful', topics: ['What is CSS?', 'Colors & Fonts', 'Simple Styling'] },
                  { icon: '⚡', title: 'JavaScript Start', desc: 'Make things interactive', topics: ['What is JS?', 'Variables', 'Simple Functions'] }
                ] : skillLevel === 'beginner' ? [
                  { icon: '🌐', title: 'HTML Basics', desc: 'Learn the structure of web pages', topics: ['Tags & Elements', 'Forms & Inputs', 'Semantic HTML'] },
                  { icon: '🎨', title: 'CSS Styling', desc: 'Design beautiful websites', topics: ['Selectors & Properties', 'Box Model', 'Basic Layouts'] },
                  { icon: '⚡', title: 'JavaScript', desc: 'Add interactivity to your sites', topics: ['Variables & Functions', 'DOM Manipulation', 'Events & Logic'] }
                ] : skillLevel === 'basics' ? [
                  { icon: '🌐', title: 'Advanced HTML', desc: 'Master HTML5 features', topics: ['Canvas & SVG', 'Web APIs', 'Accessibility'] },
                  { icon: '🎨', title: 'Advanced CSS', desc: 'Professional styling', topics: ['Flexbox & Grid', 'Animations', 'Responsive Design'] },
                  { icon: '⚡', title: 'Modern JavaScript', desc: 'ES6+ features', topics: ['Arrow Functions', 'Promises & Async', 'Modules'] }
                ] : [
                  { icon: '🌐', title: 'Web Performance', desc: 'Optimize your websites', topics: ['Performance Metrics', 'Lazy Loading', 'Code Splitting'] },
                  { icon: '🎨', title: 'CSS Architecture', desc: 'Scalable styling systems', topics: ['CSS-in-JS', 'Design Systems', 'Advanced Animations'] },
                  { icon: '⚡', title: 'Advanced JS', desc: 'Master JavaScript', topics: ['Design Patterns', 'Web Workers', 'Advanced Optimization'] }
                ]
              ) : learningPath === 'mobile-apps' ? (
                skillLevel === 'learning' ? [
                  { icon: '📱', title: 'Mobile Intro', desc: 'What are mobile apps?', topics: ['App Basics', 'Your First Screen', 'Simple Buttons'] },
                  { icon: '⚛️', title: 'App.js Start', desc: 'Build your first app', topics: ['App Structure', 'Simple Components', 'Basic Styling'] },
                  { icon: '🔧', title: 'Basic Tools', desc: 'Tools you need', topics: ['Setup Environment', 'Emulator Basics', 'Simple Testing'] }
                ] : skillLevel === 'beginner' ? [
                  { icon: '📱', title: 'React Native', desc: 'Build cross-platform mobile apps', topics: ['Components & Props', 'Navigation', 'Native APIs'] },
                  { icon: '⚛️', title: 'App.js Basics', desc: 'Master mobile app structure', topics: ['App Setup', 'State Management', 'Styling'] },
                  { icon: '🔧', title: 'Mobile Tools', desc: 'Essential development tools', topics: ['Expo', 'Debugging', 'Testing'] }
                ] : skillLevel === 'basics' ? [
                  { icon: '📱', title: 'Advanced React Native', desc: 'Professional mobile apps', topics: ['Custom Hooks', 'Performance', 'Native Modules'] },
                  { icon: '⚛️', title: 'State Management', desc: 'Complex app state', topics: ['Redux', 'Context API', 'Async State'] },
                  { icon: '🔧', title: 'Advanced Tools', desc: 'Pro development workflow', topics: ['CI/CD', 'App Distribution', 'Analytics'] }
                ] : [
                  { icon: '📱', title: 'Mobile Architecture', desc: 'Scalable app design', topics: ['Design Patterns', 'Micro-frontends', 'Code Reusability'] },
                  { icon: '⚛️', title: 'Performance Optimization', desc: 'Lightning fast apps', topics: ['Memory Management', 'Rendering Optimization', 'Bundle Size'] },
                  { icon: '🔧', title: 'Enterprise Tools', desc: 'Production-grade apps', topics: ['Monitoring', 'Security', 'Scalability'] }
                ]
              ) : (
                skillLevel === 'learning' ? [
                  { icon: '🌐', title: 'HTML Basics', desc: 'Learn the structure of web pages', topics: ['What is HTML?', 'Your First Tag', 'Basic Structure'] },
                  { icon: '🎨', title: 'CSS Intro', desc: 'Make things colorful', topics: ['What is CSS?', 'Colors & Fonts', 'Simple Styling'] },
                  { icon: '⚡', title: 'JavaScript Start', desc: 'Make things interactive', topics: ['What is JS?', 'Variables', 'Simple Functions'] },
                  { icon: '🐍', title: 'Python Intro', desc: 'Your first programming language', topics: ['What is Python?', 'Print & Input', 'Simple Math'] }
                ] : skillLevel === 'beginner' ? [
                  { icon: '🌐', title: 'HTML Basics', desc: 'Learn the structure of web pages', topics: ['Tags & Elements', 'Forms & Inputs', 'Semantic HTML'] },
                  { icon: '🎨', title: 'CSS Styling', desc: 'Design beautiful websites', topics: ['Selectors & Properties', 'Flexbox & Grid', 'Animations'] },
                  { icon: '⚡', title: 'JavaScript', desc: 'Add interactivity to your sites', topics: ['Variables & Functions', 'DOM Manipulation', 'Events & Logic'] },
                  { icon: '🐍', title: 'Python', desc: 'Start with beginner-friendly code', topics: ['Syntax & Data Types', 'Loops & Conditions', 'Functions & Modules'] }
                ] : skillLevel === 'basics' ? [
                  { icon: '🌐', title: 'Advanced HTML', desc: 'Master HTML5 features', topics: ['Canvas & SVG', 'Web APIs', 'Accessibility'] },
                  { icon: '🎨', title: 'Advanced CSS', desc: 'Professional styling', topics: ['Flexbox & Grid', 'Animations', 'Responsive Design'] },
                  { icon: '⚡', title: 'Modern JavaScript', desc: 'ES6+ features', topics: ['Arrow Functions', 'Promises & Async', 'Modules'] },
                  { icon: '🐍', title: 'Advanced Python', desc: 'Professional Python', topics: ['OOP', 'Decorators', 'Generators'] }
                ] : [
                  { icon: '🌐', title: 'Web Performance', desc: 'Optimize your websites', topics: ['Performance Metrics', 'Lazy Loading', 'Code Splitting'] },
                  { icon: '🎨', title: 'CSS Architecture', desc: 'Scalable styling systems', topics: ['CSS-in-JS', 'Design Systems', 'Advanced Animations'] },
                  { icon: '⚡', title: 'Advanced JS', desc: 'Master JavaScript', topics: ['Design Patterns', 'Web Workers', 'Advanced Optimization'] },
                  { icon: '🐍', title: 'Python Mastery', desc: 'Expert Python programming', topics: ['Metaclasses', 'Async Programming', 'Performance Tuning'] }
                ]
              )).map((course, i) => (
                <div key={i} className={`border-2 rounded-2xl p-6 hover:-translate-y-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#333] hover:border-white'
                    : 'bg-gray-50 border-gray-300 hover:border-black'
                }`}>
                  <div className="text-5xl mb-4">{course.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{course.desc}</p>
                  <ul className="space-y-2 mb-6 text-left">
                    {course.topics.map((topic, j) => (
                      <li key={j} className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>✓ {topic}</li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveCourse(course.title)} className={`w-full py-2 rounded-lg font-bold transition ${
                    theme === 'dark'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                    {t('startCourse', language)}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="py-8 md:py-16 px-4 md:px-8 pb-20 md:pb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">{t('whyWiskter', language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: '📚', title: t('structuredLearning', language), desc: t('structuredDesc', language) },
                { icon: '💻', title: t('handsOnPractice', language), desc: t('handsOnDesc', language) },
                { icon: '🚀', title: t('fastProgress', language), desc: t('fastProgressDesc', language) }
              ].map((feature, i) => (
                <div key={i} className={`text-center p-8 border-2 rounded-2xl hover:-translate-y-1 transition ${
                  theme === 'dark'
                    ? 'bg-[#111] border-[#333]'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
            </>
          )}

            <footer className={`border-t py-8 text-center ${
              theme === 'dark'
                ? 'border-white/10 text-gray-400'
                : 'border-black/10 text-gray-600'
            }`}>
              <p>{t('footer', language)}</p>
            </footer>
          </div>

          <Dialog open={showForgotPassword} onClose={() => { setShowForgotPassword(false); setResetEmail(''); }} title="Reset Password">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
              <p className="text-xs text-yellow-400">⚠️ Check your spam folder if you don't see the email</p>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                />
              </div>
              
              <button
                onClick={async () => {
                  if (!resetEmail) {
                    alert('Please enter your email');
                    return;
                  }
                  try {
                    await sendPasswordResetEmail(auth, resetEmail);
                    alert('Password reset email sent! Check your inbox (and spam folder).');
                    setShowForgotPassword(false);
                    setResetEmail('');
                  } catch (error: any) {
                    alert('Error: ' + error.message);
                  }
                }}
                disabled={!resetEmail}
                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Send Reset Link
              </button>
              
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowAuth(true);
                  setResetEmail('');
                }}
                className="w-full py-2 text-gray-400 hover:text-white transition text-sm"
              >
                Back to Sign In
              </button>
            </div>
          </Dialog>

          <Dialog open={showTerminal} onClose={() => setShowTerminal(false)} title="Terminal - Setup Instructions">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">For larger projects with dependencies, set up a local development environment:</p>
              
              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'bg-black border-white/20' : 'bg-gray-100 border-black/20'
              }`}>
                <h3 className="font-bold text-white mb-2">📦 Install Node.js</h3>
                <p className="text-sm mb-2">Download from: <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">nodejs.org</a></p>
              </div>

              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'bg-black border-white/20' : 'bg-gray-100 border-black/20'
              }`}>
                <h3 className="font-bold text-white mb-2">🚀 Create Project</h3>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400 mb-2">npx create-react-app my-app</code>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400">npm create vite@latest my-app</code>
              </div>

              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'bg-black border-white/20' : 'bg-gray-100 border-black/20'
              }`}>
                <h3 className="font-bold text-white mb-2">📥 Install Dependencies</h3>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400 mb-2">npm install package-name</code>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400">npm install react framer-motion</code>
              </div>

              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'bg-black border-white/20' : 'bg-gray-100 border-black/20'
              }`}>
                <h3 className="font-bold text-white mb-2">▶️ Run Development Server</h3>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400 mb-2">npm run dev</code>
                <code className="block bg-black/50 p-2 rounded text-xs text-green-400">npm start</code>
              </div>

              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'bg-black border-white/20' : 'bg-gray-100 border-black/20'
              }`}>
                <h3 className="font-bold text-white mb-2">💡 Recommended Tools</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>VS Code</strong> - Code editor</li>
                  <li>• <strong>Git</strong> - Version control</li>
                  <li>• <strong>pnpm/yarn</strong> - Alternative package managers</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 pt-2">💡 Tip: Use the Free Will Playground for quick experiments, and local setup for full projects!</p>
            </div>
          </Dialog>

          <Dialog open={showFAQ} onClose={() => setShowFAQ(false)} title="Frequently Asked Questions">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h3 className="font-bold text-white mb-2">❓ What is Wiskter?</h3>
                <p className="text-sm">Wiskter is an interactive coding education platform that helps beginners learn programming through hands-on practice and AI-powered assistance.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">🆓 Is Wiskter free?</h3>
                <p className="text-sm">Yes! Wiskter is completely free to use. All courses, lessons, and AI assistance are available at no cost.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">💾 How do I save my progress?</h3>
                <p className="text-sm">Sign up for a free account to automatically save your progress. Your completed lessons and achievements will be stored locally.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">🤖 What is the AI Assistant?</h3>
                <p className="text-sm">Our AI chatbot helps you when you're stuck. Ask questions about code, request hints, or get explanations on any programming concept.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">🌍 What languages are supported?</h3>
                <p className="text-sm">Wiskter supports 13+ languages including English, Spanish, French, German, Chinese, Japanese, and more. Change language in Settings.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">📱 Can I use Wiskter on mobile?</h3>
                <p className="text-sm">Yes! Wiskter is fully responsive and works great on phones, tablets, and desktops.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">🎓 What can I learn?</h3>
                <p className="text-sm">HTML, CSS, JavaScript, Python, and React Native. Choose your skill level (Learning, Beginner, Intermediate, Expert) for personalized content.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">🎨 What is Free Will Playground?</h3>
                <p className="text-sm">A live code editor where you can freely experiment with HTML, CSS, and JavaScript. See your changes in real-time with instant preview.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">💬 How do I get help?</h3>
                <p className="text-sm">Click the 🤖 AI Helper button during lessons, or join our Discord community for support from other learners and mentors.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">⭐ How can I support Wiskter?</h3>
                <p className="text-sm">Rate us in Settings, share with friends, and provide feedback. Your support helps us improve!</p>
              </div>
              <p className="text-xs text-gray-500 text-center pt-4 border-t border-white/10">Made by Som Giri</p>
            </div>
          </Dialog>

          <Dialog open={showAbout} onClose={() => setShowAbout(false)} title="About Wiskter">
            <p className="mb-4">
              Wiskter - Learn Coding is an interactive coding education platform designed to help beginners master programming fundamentals.
            </p>
            <p className="mb-4">
              We offer structured courses in HTML, CSS, JavaScript, and Python with hands-on practice and instant feedback.
            </p>
            <p>
              Our mission is to make coding accessible and fun for everyone, regardless of their background or experience level.
            </p>
          </Dialog>

          <Dialog open={showQuitDialog} onClose={() => setShowQuitDialog(false)} title="Quit Lesson?">
            <div className="space-y-4">
              <p className="text-gray-300">Are you sure you want to quit this lesson?</p>
              <p className="text-red-400 font-semibold">⚠️ Your progress will be lost!</p>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowQuitDialog(false)} className="flex-1 py-3 border-2 border-white/20 text-white rounded-lg font-bold hover:bg-white/10 transition">
                  Cancel
                </button>
                <button onClick={() => {
                  if (quitAction) quitAction();
                  setShowQuitDialog(false);
                  setActiveLesson(0);
                  setCurrentStep(0);
                  setCurrentTask(1);
                  setUserCode('');
                  setCodeError('');
                  setCodeOutput(null);
                }} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition">
                  Quit Lesson
                </button>
              </div>
            </div>
          </Dialog>

          <Dialog open={showAuth} onClose={() => setShowAuth(false)} title={isSignUp ? "Sign Up" : "Sign In"}>
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                {isSignUp ? 'Create an account to save your progress' : 'Welcome back! Sign in to continue learning'}
              </p>
              
              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                />
              </div>
              
              <button
                onClick={async () => {
                  if (!email || !password || (isSignUp && !username)) return;
                  
                  try {
                    if (isSignUp) {
                      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                      await sendEmailVerification(userCredential.user);
                      alert('Account created! Please check your email to verify your account.');
                    } else {
                      await signInWithEmailAndPassword(auth, email, password);
                    }
                    
                    setShowAuth(false);
                    setShowSignInAnimation(true);
                    setTimeout(() => {
                      setIsLoggedIn(true);
                      setTimeout(() => {
                        setShowSignInAnimation(false);
                      }, 2000);
                    }, 1500);
                    
                    setEmail('');
                    setPassword('');
                    setUsername('');
                  } catch (error: any) {
                    if (error.code === 'auth/email-already-in-use') {
                      alert('Account already exists! Please sign in.');
                    } else if (error.code === 'auth/invalid-credential') {
                      alert('Invalid email or password!');
                    } else if (error.code === 'auth/weak-password') {
                      alert('Password should be at least 6 characters!');
                    } else {
                      alert('Error: ' + error.message);
                    }
                  }
                }}
                disabled={!email || !password || (isSignUp && !username)}
                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all hover:scale-105 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
              
              <div className="text-center pt-4 space-y-2">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-400 hover:text-white transition block w-full"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
                {!isSignUp && (
                  <button
                    onClick={() => {
                      setShowAuth(false);
                      setShowForgotPassword(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            </div>
          </Dialog>

          <Dialog open={showRating} onClose={() => setShowRating(false)} title="Rate Your Experience">
            <div className="space-y-4">
              <p className="text-gray-300 text-center">How was this lesson?</p>
              <div className="flex justify-center">
                <StarRating 
                  size="lg"
                  onRate={(rating) => setUserRating(rating)}
                />
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts... (optional)"
                className="w-full h-24 bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-white focus:outline-none resize-none"
              />
              <button
                onClick={() => {
                  if (userRating > 0) {
                    sendRatingEmail(userRating, feedback, 'Lesson Completed');
                    setShowRating(false);
                    setShowThankYou(true);
                    setTimeout(() => {
                      setShowThankYou(false);
                      setUserRating(0);
                      setFeedback('');
                    }, 3000);
                  }
                }}
                disabled={userRating === 0}
                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => {
                  setShowRating(false);
                  setUserRating(0);
                  setFeedback('');
                }}
                className="w-full py-2 text-gray-400 hover:text-white transition text-sm"
              >
                Skip
              </button>
            </div>
          </Dialog>

          {showSignInAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="text-9xl mb-6"
                >
                  ✓
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                >
                  Welcome Back!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-2xl text-gray-300"
                >
                  Successfully signed in 🎉
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {showThankYou && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="text-9xl mb-6"
                >
                  ⭐
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  Thank You!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl text-gray-300"
                >
                  We appreciate your feedback! 💙
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8 flex justify-center gap-4"
                >
                  {[...Array(userRating || websiteRating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="text-4xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          <Dialog open={showWhatsNew} onClose={() => setShowWhatsNew(false)} title="What's New? 🎉" className="bg-black text-white">
            <div className="space-y-6">
              <div className="text-white text-sm">
                <p className="mb-4 font-bold">Version 1.2</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Interactive Hover Button</h3>
                      <p className="text-sm text-gray-300">New animated button component with smooth hover effects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">AI Learning Assistant</h3>
                      <p className="text-sm text-gray-300">Get instant help with coding questions from our smart chatbot</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Free Will Playground</h3>
                      <p className="text-sm text-gray-300">Code freely with HTML, CSS, and JavaScript in real-time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Multi-language Support</h3>
                      <p className="text-sm text-gray-300">Learn in 13+ languages including English, Spanish, Chinese, Estonian, and more</p>
                      <p className="text-xs text-gray-500 mt-1">📍 Find in: Settings → Language</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Rate Wiskter</h3>
                      <p className="text-sm text-gray-300">Share your feedback and rate your learning experience</p>
                      <p className="text-xs text-gray-500 mt-1">📍 Find in: Settings → Rate Wiskter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Discord Community</h3>
                      <p className="text-sm text-gray-300">Join our Discord server for help, discussions, and community support</p>
                      <p className="text-xs text-gray-500 mt-1">📍 Find in: Settings → Discord Link</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-white">Improved User Interface</h3>
                      <p className="text-sm text-gray-300">Enhanced design with better navigation and smoother animations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog open={showSettings} onClose={() => setShowSettings(false)} title="Settings">
            <div className="space-y-4">
              {!isLoggedIn && (
                <div className="pb-4 border-b border-white/20">
                  <p className="text-sm text-gray-400 mb-3">{t('saveProgress', language)}</p>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setShowAuth(true);
                    }}
                    className="w-full py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              )}
              {isLoggedIn && (
                <div className="pb-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <span>✓</span> {t('signedIn', language)}
                    </p>
                    <button
                      onClick={async () => {
                        await signOut(auth);
                        setIsLoggedIn(false);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition"
                    >
                      {t('signOut', language)}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-2">{t('theme', language)}</label>
                <select 
                  value={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  onChange={(e) => setTheme(e.target.value === 'Dark Mode' ? 'dark' : 'light')}
                  className={`w-full border rounded-lg px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-black border-white/20 text-white'
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option>{t('darkMode', language)}</option>
                  <option>{t('lightMode', language)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('language', language)}</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-black border-white/20 text-white'
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="ru">Русский</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="ar">العربية</option>
                  <option value="hi">हिन्दी</option>
                  <option value="et">Eesti</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">{t('enableNotifications', language)}</span>
                </label>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm font-semibold mb-3">{t('rateWiskter', language)}</p>
                <div className="flex justify-center mb-3">
                  <StarRating 
                    size="md"
                    onRate={(rating) => setWebsiteRating(rating)}
                  />
                </div>
                <textarea
                  value={websiteFeedback}
                  onChange={(e) => setWebsiteFeedback(e.target.value)}
                  placeholder={t('shareThoughts', language)}
                  className="w-full h-20 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-white focus:outline-none resize-none mb-3"
                />
                <button
                  onClick={() => {
                    if (websiteRating > 0) {
                      sendRatingEmail(websiteRating, websiteFeedback, 'Website Rating');
                      setShowSettings(false);
                      setShowThankYou(true);
                      setTimeout(() => {
                        setShowThankYou(false);
                        setWebsiteRating(0);
                        setWebsiteFeedback('');
                      }, 3000);
                    }
                  }}
                  disabled={websiteRating === 0}
                  className="w-full py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('submitRating', language)}
                </button>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-gray-400">
                  {t('needHelp', language)} <a href="https://discord.gg/YBmfqxmQhZ" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300">{t('discordServer', language)}</a>
                </p>
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default App
