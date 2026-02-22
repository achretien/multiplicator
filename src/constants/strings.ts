export function getStrings() {
  return {
    // App
    appName: 'Multiplicator',
    appSubtitle: 'Choisis tes options et joue !',

    // Menu labels
    tablesToReview: '\u{1F4DA} Tables \u00E0 r\u00E9viser',
    gameMode: '\u{1F3AE} Mode de jeu',
    questionCount: '\u2753 Nombre de questions',
    playSolo: '\u{1F680} Jouer en solo',
    playDuel: '\u2694\uFE0F Duel Enfant vs Parent !',
    historyButton: '\u{1F4DC} Historique des parties',

    // Mode names
    modeQcm: 'Choix multiple',
    modeInput: '\u00C9crire',

    // Timer option
    timerLabel: '\u23F1\uFE0F Limite de temps',
    timerOptions: ['Aucune', '10s', '5s', '2s'] as readonly string[],

    // Player names
    playerChild: 'Enfant',
    playerParent: 'Parent',

    // HUD
    hudQuestion: 'QUESTION',
    hudScore: 'SCORE',
    hudStreak: 'S\u00C9RIE',

    // Game screen
    questionLabel: (n: number) => `Question ${n}`,
    validate: '\u2713 Valider',
    abandon: '\u{1F3E0} Abandonner',

    // Feedback
    correctMessages: [
      '\u2B50 Excellent !',
      '\u{1F389} Parfait !',
      '\u{1F525} Super !',
      '\u{1F4AA} Bravo !',
    ] as readonly string[],
    wrongAnswer: (ans: number) => `\u274C La r\u00E9ponse \u00E9tait ${ans}`,

    // Quit modal
    quitTitle: 'Abandonner ?',
    quitSub: 'Ta progression sera perdue.',
    quitConfirm: 'Oui, abandonner',
    quitCancel: 'Continuer \u00E0 jouer',

    // Results
    points: 'points',
    correctLabel: '\u2705 Bonnes',
    errorsLabel: '\u274C Erreurs',
    maxStreakLabel: '\u{1F525} S\u00E9rie max',
    replay: '\u{1F504} Rejouer',
    menu: '\u{1F3E0} Menu',

    // Result tiers
    resultTier1: { emoji: '\u{1F3C6}', title: 'Incroyable !', sub: 'Tu es un champion des tables !' },
    resultTier2: { emoji: '\u{1F31F}', title: 'Tr\u00E8s bien !', sub: 'Continue comme \u00E7a !' },
    resultTier3: { emoji: '\u{1F44D}', title: 'Bien jou\u00E9 !', sub: "Encore un peu d'entra\u00EEnement !" },
    resultTier4: { emoji: '\u{1F4AA}', title: 'Courage !', sub: 'Pratique encore, tu vas y arriver !' },

    // Duel
    duelEquality: '\u00C9galit\u00E9 !',
    duelEqualitySub: "Vous \u00EAtes aussi forts l'un que l'autre !",
    duelWonSuffix: 'a remport\u00E9 le duel !',
    rematch: '\u2694\uFE0F Revanche !',

    // Duel score card
    pts: 'pts',

    // Handover
    handoverYourTurn: "C'est ton tour ! Pr\u00EAt(e) ?",
    handoverPassTablet: (name: string) => `Passe la tablette \u00E0 ${name} ! Pr\u00EAt ?`,
    handoverGo: "C'est parti !",

    // History
    historyTitle: '\u{1F4DC} Historique',
    historySub: 'Toutes tes parties sauvegard\u00E9es',
    historyEmpty: '\u{1F634} Aucune partie enregistr\u00E9e\nJoue ta premi\u00E8re partie !',
    historyClear: "\u{1F5D1}\uFE0F Effacer l'historique",
    historyClearConfirm: "Effacer tout l'historique ?",
    historyClearTitle: "Effacer l'historique",
    historyCancel: 'Annuler',
    historyClearAction: 'Effacer',

    // History entries
    historyCorrectCount: (correct: number, total: number) => `${correct}/${total} bonnes`,
    historyTables: (tables: number[]) => `Tables : ${tables.join(', ')}`,
    historyChildWins: '\u{1F476} Enfant gagne \u{1F3C6}',
    historyParentWins: '\u{1F468} Parent gagne \u{1F3C6}',
    historyDraw: '\u00C9galit\u00E9 \u{1F91D}',

    // Game detail
    gameDetailTitle: '\u{1F4CB} R\u00E9capitulatif',
    gameDetailTimeout: '\u23F1\uFE0F',
    gameDetailNoData: 'D\u00E9tails non disponibles\n(partie jou\u00E9e avec une ancienne version)',

    // Date formatting
    dateLocale: 'fr-FR',
    dateTimeSeparator: ' \u00E0 ',

    // GitHub ribbon
    github: 'GitHub',
  };
}

export type Strings = ReturnType<typeof getStrings>;
