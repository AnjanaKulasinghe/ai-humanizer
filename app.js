
// Pure JS implementation for advanced AI humanizer
let currentLevel = 'medium';

window.setLevel = setLevel;
function setLevel(level) {
  currentLevel = level;
  ['light', 'medium', 'heavy'].forEach(l => {
    const btn = document.getElementById(`btn-${l}`);
    if (l === level) {
      btn.className = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all bg-purple-600 text-white shadow-lg';
    } else {
      btn.className = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  });
}

window.humanize = humanize;
window.setLevel = setLevel;
window.copyText = copyText;
function humanize() {
  const input = document.getElementById('inputText').value;
  if (!input.trim()) return;
  const output = superHumanizeText(input, currentLevel);
  document.getElementById('outputText').value = output;
  document.getElementById('outputCount').textContent = output.length + ' characters';
  document.getElementById('copyBtn').classList.remove('hidden');
}

function copyText() {
  const output = document.getElementById('outputText');
  output.select();
  document.execCommand('copy');
  const btn = document.getElementById('copyBtn');
  btn.textContent = '✅';
  setTimeout(() => btn.textContent = '📋', 2000);
}

// --- SUPER ADVANCED HUMANIZER ---
function superHumanizeText(text, level) {
  if (!text.trim()) return '';
  // Split into sentences (improved)
  let sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];

  // Advanced features
  const fillers = {
    light: ['Well, ', 'So, ', 'Now, '],
    medium: ['Well, ', 'You know, ', 'Actually, ', 'Honestly, ', 'I think ', 'Look, ', 'So, ', 'Basically, '],
    heavy: ['Well, ', 'You know, ', 'Actually, ', 'Honestly, ', 'I think ', 'Look, ', 'So, ', 'Basically, ',
      'To be honest, ', 'I mean, ', 'The thing is, ', "Here's the deal - ", 'Let me tell you, ',
      'No kidding, ', 'Frankly, ', 'Guess what? ', 'Just saying, ']
  };
  const transitions = {
    light: ['And ', 'But ', 'So '],
    medium: ['Plus, ', 'And ', 'But ', 'So ', 'Anyway, ', 'Though, ', 'Still, '],
    heavy: ['Plus, ', 'And ', 'But ', 'So ', 'Anyway, ', 'Though, ', 'Still, ',
      'On top of that, ', 'That said, ', 'Either way, ', 'In any case, ',
      'By the way, ', 'Just so you know, ']
  };
  // --- Hybrid, scalable vocabulary approach ---
  // 1. Domain-specific (AWS/cloud/data/security/optimization)
  // 2. General English (slang, idioms, contractions, business, etc.)
  // 3. Externalized: load from external file or split into modules for 20,000+ entries

  // Example: Load from window.humanizerVocab if present (external file), else use built-in
  // --- Paraphrasing diversity: multiple alternatives per term ---
  // Each entry is now {pattern, replaces: [array of alternatives]}
  // --- MASSIVE VOCABULARY SUPPORT ---
  // If window.humanizerVocab is present (from an external JS/JSON file), use it. Otherwise, use a small built-in sample.
  // To scale: create a file like `humanizer-vocab.js` with:
  // window.humanizerVocab = [
  //   {pattern: /example/gi, replaces: ['alt1', 'alt2', ...]},
  //   ... 100,000+ entries ...
  // ];
  let awsSynonyms = window.humanizerVocab || [
    // SAMPLE ONLY: For production, load a huge array from an external file.
    { pattern: /security vulnerabilities/gi, replaces: ['security issues', 'potential weaknesses', 'security gaps', 'vulnerability points'] },
    { pattern: /applications/gi, replaces: ['software', 'apps', 'programs', 'solutions'] },
    { pattern: /servers/gi, replaces: ['infrastructure', 'server machines', 'host systems', 'backend systems'] },
    // ...add more as needed for testing...
  ];

  // --- FULL SENTENCE/PHRASE REWRITES ---
  // These are applied before word-level substitutions for maximum effect
  const sentenceRewrites = [
    {
      pattern: /Identifying security vulnerabilities starts with understanding what you’re protecting\./gi,
      replaces: [
        'To begin addressing security issues, first clarify what assets require protection.',
        'Understanding your protection targets is the first step in recognizing security gaps.',
        'The process of finding security weaknesses begins with knowing what you need to safeguard.',
        'Recognizing what you must defend is the foundation for identifying vulnerabilities.',
        'A clear grasp of your protected assets is essential before you can spot security flaws.'
      ]
    },
    {
      pattern: /Begin by listing all your applications, servers, APIs, databases, and third-party services, then classify the data they handle—whether it’s public, internal, sensitive, or personal\./gi,
      replaces: [
        'Start by cataloging your software, infrastructure, interfaces, data stores, and external providers, then categorize the types of data they process—public, internal, sensitive, or personal.',
        'First, enumerate all your digital assets and classify the nature of the data they manage, from public to confidential.',
        'List every application, server, API, database, and third-party service, and sort the data they handle by sensitivity.',
        'Make an inventory of all systems and services, then determine the classification of the data they process.',
        'Document your technology stack and assign a sensitivity level to each data type handled.'
      ]
    },
    {
      pattern: /Once you know your assets, map how data flows between them to spot weak points\./gi,
      replaces: [
        'After identifying your resources, analyze data movement between them to uncover vulnerabilities.',
        'With your assets mapped, examine data transfers to detect potential risk points.',
        'When you have a clear asset inventory, trace data flows to find exposed areas.',
        'Mapping data exchanges between assets can reveal hidden weaknesses.',
        'Study the pathways data takes to identify where your defenses may be thin.'
      ]
    },
    {
      pattern: /Treating vulnerability identification as an ongoing process—not a one-time task—helps keep your systems resilient and your data safe\./gi,
      replaces: [
        'Maintaining vigilance in vulnerability detection ensures your systems remain robust and your information secure.',
        'Viewing vulnerability discovery as a continuous effort, rather than a single event, strengthens your security posture.',
        'Ongoing attention to vulnerabilities is key to keeping your environment protected.',
        'Consistent review of vulnerabilities is vital for lasting security.',
        'Making vulnerability identification a routine part of operations helps safeguard your data.'
      ]
    },
    // More rewrites for other common phrases
    {
      pattern: /Next, use automated tools to catch common issues quickly\./gi,
      replaces: [
        'Then, leverage automation to rapidly detect frequent problems.',
        'Utilize automated solutions to efficiently identify typical security concerns.',
        'Employ scanning tools to quickly surface common vulnerabilities.',
        'Automated tools can expedite the discovery of widespread issues.'
      ]
    },
    {
      pattern: /After automation, dive deeper with manual testing\./gi,
      replaces: [
        'Once automation is complete, conduct a thorough manual review.',
        'Following automated checks, proceed with hands-on testing for deeper insights.',
        'Manual assessment is crucial after automated scans to catch nuanced flaws.',
        'A detailed manual evaluation should follow automation to ensure nothing is missed.'
      ]
    },
    // ...add more full-sentence/phrase rewrites for common patterns...
  ];

  // --- INSTRUCTIONS FOR MASSIVE VOCABULARY ---
  // 1. Create a file named `humanizer-vocab.js` in your project.
  // 2. Populate it with:
  //    window.humanizerVocab = [
  //      {pattern: /your term/gi, replaces: ['alt1', 'alt2', ...]},
  //      ...
  //    ];
  // 3. Add 10,000+ (or 100,000+) entries as needed.
  // 4. Include <script src="humanizer-vocab.js"></script> before <script src="app.js"></script> in your HTML.
  // 5. The app will automatically use the external vocabulary for unlimited paraphrasing diversity.

  // To scale: create a separate JS/JSON file with window.humanizerVocab = [ ...20,000+ entries... ];
  // Then include it in index.html before app.js
  // General slang and simplification (keep existing for non-AWS terms)
  const slang = [
    { pattern: /children/gi, replace: 'kids' },
    { pattern: /difficult/gi, replace: 'tough' },
    { pattern: /intelligent/gi, replace: 'smart' },
    { pattern: /purchase/gi, replace: 'buy' },
    { pattern: /assist/gi, replace: 'help' },
    { pattern: /incorrect/gi, replace: 'wrong' },
    { pattern: /approximately/gi, replace: 'about' },
    { pattern: /therefore/gi, replace: 'so' },
    { pattern: /consequently/gi, replace: 'so' },
    { pattern: /utilize/gi, replace: 'use' },
    { pattern: /commence/gi, replace: 'start' },
    { pattern: /terminate/gi, replace: 'end' },
    { pattern: /endeavor/gi, replace: 'try' },
    { pattern: /reside/gi, replace: 'live' },
    { pattern: /obtain/gi, replace: 'get' },
    { pattern: /individual/gi, replace: 'person' },
    { pattern: /assistance/gi, replace: 'help' },
    { pattern: /numerous/gi, replace: 'lots of' },
    { pattern: /frequently/gi, replace: 'often' },
    { pattern: /inquire/gi, replace: 'ask' },
    { pattern: /respond/gi, replace: 'answer' },
    { pattern: /incorrect/gi, replace: 'wrong' },
    { pattern: /subsequently/gi, replace: 'then' },
    { pattern: /prior to/gi, replace: 'before' },
    { pattern: /subsequent to/gi, replace: 'after' },
    { pattern: /commonly/gi, replace: 'usually' },
    { pattern: /obtain/gi, replace: 'get' },
    { pattern: /endeavor/gi, replace: 'try' }
  ];
  const aiPatterns = [
    { pattern: /In conclusion,/gi, replace: 'So,' },
    { pattern: /In summary,/gi, replace: 'Basically,' },
    { pattern: /Firstly,/gi, replace: 'First,' },
    { pattern: /Secondly,/gi, replace: 'Second,' },
    { pattern: /Thirdly,/gi, replace: 'Third,' },
    { pattern: /Overall,/gi, replace: 'All in all,' },
    { pattern: /To summarize,/gi, replace: 'Long story short,' },
    { pattern: /It can be concluded that/gi, replace: 'Looks like' },
    { pattern: /It is important to note that/gi, replace: 'Just so you know,' },
    { pattern: /This essay will/gi, replace: 'Let me' },
    { pattern: /This article will/gi, replace: 'Let me' }
  ];
  const contractions = [
    { pattern: /\bdo not\b/gi, replace: "don't" },
    { pattern: /\bdoes not\b/gi, replace: "doesn't" },
    { pattern: /\bcannot\b/gi, replace: "can't" },
    { pattern: /\bwill not\b/gi, replace: "won't" },
    { pattern: /\bit is\b/gi, replace: "it's" },
    { pattern: /\bI am\b/gi, replace: "I'm" },
    { pattern: /\byou are\b/gi, replace: "you're" },
    { pattern: /\bwe are\b/gi, replace: "we're" },
    { pattern: /\bwould not\b/gi, replace: "wouldn't" },
    { pattern: /\bshould not\b/gi, replace: "shouldn't" },
    { pattern: /\bcould not\b/gi, replace: "couldn't" },
    { pattern: /\bI have\b/gi, replace: "I've" },
    { pattern: /\bI will\b/gi, replace: "I'll" },
    { pattern: /\bI would\b/gi, replace: "I'd" },
    { pattern: /\bI had\b/gi, replace: "I'd" },
    { pattern: /\bthey are\b/gi, replace: "they're" },
    { pattern: /\bthey have\b/gi, replace: "they've" },
    { pattern: /\bthey will\b/gi, replace: "they'll" },
    { pattern: /\bthey would\b/gi, replace: "they'd" },
    { pattern: /\bthey had\b/gi, replace: "they'd" }
  ];
  // Typos and errors for heavy mode
  function addTypos(text) {
    // Only introduce a few, and not in every sentence
    const typoMap = [
      { pattern: /the/gi, replace: 'teh' },
      { pattern: /and/gi, replace: 'adn' },
      { pattern: /because/gi, replace: 'becuase' },
      { pattern: /really/gi, replace: 'realy' },
      { pattern: /with/gi, replace: 'wiht' },
      { pattern: /just/gi, replace: 'jsut' },
      { pattern: /have/gi, replace: 'haev' }
    ];
    if (Math.random() > 0.7) {
      const typo = typoMap[Math.floor(Math.random() * typoMap.length)];
      return text.replace(typo.pattern, typo.replace);
    }
    return text;
  }
  // Add personal asides for heavy mode
  function addAside(text) {
    const asides = [
      ' (just my two cents)',
      ' (if you ask me)',
      ' (no joke)',
      ' (been there, done that)',
      ' (trust me on this)',
      ' (not gonna lie)',
      ' (for real)',
      ' (I swear)'
    ];
    if (Math.random() > 0.8) {
      return text + asides[Math.floor(Math.random() * asides.length)];
    }
    return text;
  }
  // Paraphrase: shuffle sentence order for heavy mode
  if (level === 'heavy' && sentences.length > 2 && Math.random() > 0.5) {
    sentences = shuffleArray(sentences);
  }
  // --- Sentence structure variation: split, merge, reorder, punctuation ---
  // Apply full-sentence/phrase rewrites first
  let rewrittenSentences = sentences.map(s => {
    let sent = s;
    sentenceRewrites.forEach(({ pattern, replaces }) => {
      if (pattern.test(sent)) {
        sent = replaces[Math.floor(Math.random() * replaces.length)];
      }
    });
    return sent;
  });

  let processedSentences = [];
  rewrittenSentences.forEach(s => {
    // More aggressive splitting: also split on em dashes, colons, and parentheses
    if (s.length > 160 && Math.random() > 0.4) {
      processedSentences.push(...s.split(/[,;:—()](?=\s)/g));
    } else {
      processedSentences.push(s);
    }
  });
  // Merge short sentences, sometimes join with semicolons or em dashes
  for (let i = 0; i < processedSentences.length - 1; i++) {
    if (processedSentences[i].length < 60 && processedSentences[i + 1].length < 60 && Math.random() > 0.4) {
      const joiners = [', ', '; ', ' — ', ' (', ') '];
      const joiner = joiners[Math.floor(Math.random() * joiners.length)];
      processedSentences[i] = processedSentences[i].replace(/[.!?]$/, '') + joiner + processedSentences[i + 1].trim();
      processedSentences.splice(i + 1, 1);
    }
  }
  // Optionally reorder sentences (already done for heavy)
  if (level === 'heavy' && processedSentences.length > 2 && Math.random() > 0.4) {
    processedSentences = shuffleArray(processedSentences);
  }

  // --- Main transformation with randomization ---
  let lastTransition = '';
  let lastFiller = '';
  let humanized = processedSentences.map((sent, idx) => {
    let result = sent.trim();
    // Randomize transformation order
    let steps = [
      // Remove AI patterns
      () => { aiPatterns.forEach(({ pattern, replace }) => { result = result.replace(pattern, replace); }); },
      // Add contractions
      () => { contractions.forEach(({ pattern, replace }) => { result = result.replace(pattern, replace); }); },
      // AWS synonym and paraphrase (random alternative)
      () => {
        if (level === 'heavy' || Math.random() > 0.7) {
          awsSynonyms.forEach(({ pattern, replaces }) => {
            if (pattern.test(result)) {
              // Replace all occurrences for more diversity
              result = result.replace(pattern, () => replaces[Math.floor(Math.random() * replaces.length)]);
            }
          });
        }
      },
      // Add slang/simple words
      () => { slang.forEach(({ pattern, replace }) => { result = result.replace(pattern, replace); }); },
      // Add fillers (limit to 1 every 2 sentences)
      () => {
        const threshold = level === 'heavy' ? 0.5 : level === 'medium' ? 0.7 : 0.85;
        if (Math.random() > threshold && idx > 0 && lastFiller !== idx - 1) {
          const filler = fillers[level];
          const chosen = filler[Math.floor(Math.random() * filler.length)];
          result = chosen + result;
          lastFiller = idx;
        }
      },
      // Add transitions (limit to 1 every 2 sentences, avoid starting with lowercase)
      () => {
        if (idx > 0 && Math.random() > 0.6 && lastTransition !== idx - 1) {
          const trans = transitions[level];
          const chosen = trans[Math.floor(Math.random() * trans.length)];
          if (result[0] === result[0].toUpperCase()) {
            result = chosen + result;
            lastTransition = idx;
          }
        }
      },
      // Add typos and asides for heavy
      () => {
        if (level === 'heavy') {
          result = addTypos(result);
          result = addAside(result);
        }
      },
      // Refine punctuation: avoid mid-sentence semicolons/colons, fix parentheticals/lists
      () => {
        // Replace misplaced semicolons/colons with commas
        result = result.replace(/([a-z]),?\s*[;:](?=\s*[a-z])/g, '$1,');
        // Format lists: "public) internal confidential" -> "public, internal, confidential"
        result = result.replace(/([a-zA-Z]+)\)\s*([a-zA-Z]+)/g, '$1, $2');
        // Clean up parentheticals
        result = result.replace(/\(([^)]+)\)/g, (m, p1) => {
          if (p1.split(' ').length > 6) return ': ' + p1;
          return '(' + p1 + ')';
        });
      },
      // Randomly vary punctuation for heavy and medium
      () => {
        if ((level === 'heavy' || level === 'medium') && Math.random() > 0.5) {
          const puncts = ['.', '...', '!', '—'];
          result = result.replace(/[.!?]$/, puncts[Math.floor(Math.random() * puncts.length)]);
        }
      },
      // Randomly lowercase some sentences for heavy
      () => {
        if (level === 'heavy' && Math.random() > 0.8) {
          result = result.charAt(0).toLowerCase() + result.slice(1);
        }
      },
      // Add subtle professional asides/hedges (no jokes/slang, limit to 1 every 3 sentences)
      () => {
        const hedges = [
          'perhaps', 'it seems', 'in some cases', 'to some extent', 'arguably', 'in practice', 'in many scenarios', 'in reality', 'in certain contexts', 'notably', 'as a matter of fact', 'for instance', 'in effect', 'in summary', 'in short', 'in essence', 'in particular', 'not uncommonly', 'in general', 'in principle', 'in theory', 'in application', 'as such', 'in retrospect', 'in the final analysis', 'in the long run', 'in the short term', 'in the broader context', 'in the current climate', 'in the present scenario', 'in the future', 'in hindsight'
        ];
        if (Math.random() > 0.85 && idx % 3 === 0 && idx > 0) {
          result = hedges[Math.floor(Math.random() * hedges.length)] + ', ' + result;
        }
      }
    ];
    // Shuffle steps for randomization
    steps = shuffleArray(steps);
    steps.forEach(fn => fn());
    return result;
  });
  // Join and add random line breaks for heavy
  let joined = humanized.join(' ');
  if (level === 'heavy') {
    joined = joined.replace(/([.!?]) /g, (m) => m + (Math.random() > 0.7 ? '\n' : ' '));
  }
  // Remove double spaces
  return joined.replace(/\s+/g, ' ').trim();
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// ...existing code...
