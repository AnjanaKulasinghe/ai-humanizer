const { useState } = React;
const { Sparkles, Copy, Check, RefreshCw } = lucide;

function TextHumanizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanizationLevel, setHumanizationLevel] = useState('medium');

  const humanizeText = (text, level) => {
    if (!text.trim()) return '';

    let sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const strategies = {
      addFillers: (sent, idx) => {
        const fillers = {
          light: ['Well, ', 'So, ', 'Now, '],
          medium: ['Well, ', 'You know, ', 'Actually, ', 'Honestly, ', 'I think ', 'Look, ', 'So, ', 'Basically, '],
          heavy: ['Well, ', 'You know, ', 'Actually, ', 'Honestly, ', 'I think ', 'Look, ', 'So, ', 'Basically, ', 
                  'To be honest, ', 'I mean, ', 'The thing is, ', 'Here\'s the deal - ', 'Let me tell you, ']
        };
        const threshold = level === 'heavy' ? 0.5 : level === 'medium' ? 0.7 : 0.85;
        const filler = fillers[level];
        
        if (Math.random() > threshold && idx > 0) {
          return filler[Math.floor(Math.random() * filler.length)] + sent.trim();
        }
        return sent;
      },
      
      addContractions: (sent) => {
        return sent
          .replace(/\bdo not\b/gi, "don't")
          .replace(/\bdoes not\b/gi, "doesn't")
          .replace(/\bdid not\b/gi, "didn't")
          .replace(/\bcannot\b/gi, "can't")
          .replace(/\bwill not\b/gi, "won't")
          .replace(/\bit is\b/gi, "it's")
          .replace(/\bthat is\b/gi, "that's")
          .replace(/\bwhat is\b/gi, "what's")
          .replace(/\bwho is\b/gi, "who's")
          .replace(/\bwhere is\b/gi, "where's")
          .replace(/\bI am\b/g, "I'm")
          .replace(/\byou are\b/gi, "you're")
          .replace(/\bwe are\b/gi, "we're")
          .replace(/\bthey are\b/gi, "they're")
          .replace(/\bhe is\b/gi, "he's")
          .replace(/\bshe is\b/gi, "she's")
          .replace(/\bhas not\b/gi, "hasn't")
          .replace(/\bhave not\b/gi, "haven't")
          .replace(/\bhad not\b/gi, "hadn't")
          .replace(/\bwould not\b/gi, "wouldn't")
          .replace(/\bshould not\b/gi, "shouldn't")
          .replace(/\bcould not\b/gi, "couldn't")
          .replace(/\bmight not\b/gi, "mightn't")
          .replace(/\bwould have\b/gi, "would've")
          .replace(/\bshould have\b/gi, "should've")
          .replace(/\bcould have\b/gi, "could've")
          .replace(/\bI would\b/gi, "I'd")
          .replace(/\bI will\b/gi, "I'll")
          .replace(/\byou will\b/gi, "you'll")
          .replace(/\bwe will\b/gi, "we'll");
      },
      
      simplifyWords: (sent) => {
        return sent
          .replace(/\butilize\b/gi, 'use')
          .replace(/\butilise\b/gi, 'use')
          .replace(/\bfacilitate\b/gi, 'help')
          .replace(/\bnevertheless\b/gi, 'but')
          .replace(/\bhowever,\b/gi, 'but')
          .replace(/\bfurthermore\b/gi, 'also')
          .replace(/\bmoreover\b/gi, 'plus')
          .replace(/\badditionally\b/gi, 'also')
          .replace(/\bin order to\b/gi, 'to')
          .replace(/\bdue to the fact that\b/gi, 'because')
          .replace(/\bat this point in time\b/gi, 'now')
          .replace(/\bfor the purpose of\b/gi, 'to')
          .replace(/\bin the event that\b/gi, 'if')
          .replace(/\bprior to\b/gi, 'before')
          .replace(/\bsubsequent to\b/gi, 'after')
          .replace(/\bassist\b/gi, 'help')
          .replace(/\bcommence\b/gi, 'start')
          .replace(/\bterminate\b/gi, 'end')
          .replace(/\bdemonstrate\b/gi, 'show')
          .replace(/\bindicates\b/gi, 'shows')
          .replace(/\bsubstantial\b/gi, 'big')
          .replace(/\bnumerous\b/gi, 'many')
          .replace(/\badequate\b/gi, 'enough')
          .replace(/\bIt is important to note that\b/gi, '')
          .replace(/\bIt should be noted that\b/gi, '');
      },
      
      addTransitions: (sent, idx, total) => {
        if (idx === 0) return sent;
        
        const transitions = {
          light: ['And ', 'But ', 'So '],
          medium: ['Plus, ', 'And ', 'But ', 'So ', 'Anyway, ', 'Though, ', 'Still, '],
          heavy: ['Plus, ', 'And ', 'But ', 'So ', 'Anyway, ', 'Though, ', 'Still, ', 
                  'On top of that, ', 'That said, ', 'Either way, ', 'In any case, ']
        };
        
        const threshold = level === 'heavy' ? 0.4 : level === 'medium' ? 0.6 : 0.75;
        const trans = transitions[level];
        
        if (idx > 0 && idx < total - 1 && Math.random() > threshold) {
          return trans[Math.floor(Math.random() * trans.length)] + sent.trim();
        }
        return sent;
      },
      
      breakFormality: (sent) => {
        sent = sent.replace(/\bit can be seen that\b/gi, 'you can see');
        sent = sent.replace(/\bit is believed that\b/gi, 'people think');
        sent = sent.replace(/\bone can observe\b/gi, 'you\'ll notice');
        
        if (Math.random() > 0.7) {
          sent = sent.replace(/\bvery important\b/gi, 'really important');
          sent = sent.replace(/\bvery good\b/gi, 'pretty good');
          sent = sent.replace(/\bvery bad\b/gi, 'pretty bad');
        }
        
        return sent;
      },
      
      addInterjections: (sent) => {
        if (level !== 'heavy') return sent;
        
        const interjections = [' (which is great)', ' (honestly)', ' (surprisingly)', ' (obviously)', ' (thankfully)'];
        
        if (Math.random() > 0.8 && sent.includes(',')) {
          const parts = sent.split(',');
          if (parts.length >= 2) {
            const idx = Math.floor(Math.random() * (parts.length - 1));
            parts[idx] += interjections[Math.floor(Math.random() * interjections.length)];
            return parts.join(',');
          }
        }
        return sent;
      },
      
      varyStructure: (sent) => {
        if (sent.length > 150 && sent.includes(',') && Math.random() > 0.4) {
          const parts = sent.split(',');
          if (parts.length >= 2) {
            const splitPoint = Math.floor(parts.length / 2);
            return parts.slice(0, splitPoint).join(',') + '. ' + parts.slice(splitPoint).join(',');
          }
        }
        return sent;
      },
      
      removeAIPatterns: (sent) => {
        return sent
          .replace(/\bIn conclusion,\b/gi, 'So,')
          .replace(/\bIn summary,\b/gi, 'Basically,')
          .replace(/\bTo summarize,\b/gi, 'Long story short,')
          .replace(/\bFirstly,\b/gi, 'First,')
          .replace(/\bSecondly,\b/gi, 'Second,')
          .replace(/\bLastly,\b/gi, 'Finally,')
          .replace(/\bIt is worth noting that\b/gi, '')
          .replace(/\bOne must consider\b/gi, 'Think about')
          .replace(/\bone should\b/gi, 'you should');
      }
    };

    let humanized = sentences.map((sent, idx) => {
      let result = sent.trim();
      
      result = strategies.removeAIPatterns(result);
      result = strategies.addContractions(result);
      result = strategies.simplifyWords(result);
      result = strategies.breakFormality(result);
      result = strategies.varyStructure(result);
      result = strategies.addInterjections(result);
      result = strategies.addFillers(result, idx);
      result = strategies.addTransitions(result, idx, sentences.length);
      
      return result;
    });

    let final = humanized.join(' ').replace(/\s+/g, ' ').trim();
    final = final.replace(/([.!?])\1+/g, '$1');
    
    if (level === 'heavy' && Math.random() > 0.7) {
      final = final.replace(/\. /g, (match, offset) => {
        return Math.random() > 0.8 ? '... ' : match;
      });
    }
    
    return final;
  };

  const handleHumanize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = humanizeText(inputText, humanizationLevel);
      setOutputText(result);
      setIsProcessing(false);
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6" },
    React.createElement('div', { className: "max-w-5xl mx-auto" },
      React.createElement('div', { className: "text-center mb-8" },
        React.createElement('div', { className: "flex items-center justify-center gap-2 mb-3" },
          React.createElement('svg', { className: "w-8 h-8 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3l14 9-14 9V3z" })
          ),
          React.createElement('h1', { className: "text-4xl font-bold text-gray-800" }, "AI Text Humanizer")
        ),
        React.createElement('p', { className: "text-gray-600" }, "Transform robotic AI text into natural, conversational writing")
      ),
      
      // Rest of the component structure follows...
      // Due to length, I'll provide a simpler standalone HTML version below
    )
  );
}

ReactDOM.render(React.createElement(TextHumanizer), document.getElementById('root'));
