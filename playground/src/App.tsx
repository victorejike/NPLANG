import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  ThumbsUp,
  Globe,
  Code2,
} from 'lucide-react';
import {
  runNplang,
  translateSource,
  type ExecutionResult,
  type OutputTarget,
} from '@nplang/language-core';

type TabStyle = 'natural-en' | 'concise' | 'natural-es' | 'natural-yo' | 'ai-ast';

interface ExampleSnippet {
  name: string;
  style: TabStyle;
  code: string;
}

const EXAMPLES: ExampleSnippet[] = [
  {
    name: 'Counter (English)',
    style: 'natural-en',
    code: `I have a number called score. It is 10.\nAdd 5 to score.\nShow score.`,
  },
  {
    name: 'Condition Check',
    style: 'natural-en',
    code: `I have a number called score. It is 20.\nIf score is greater than 10, show "You won!".`,
  },
  {
    name: 'Concise Mode',
    style: 'concise',
    code: `let score = 10\nscore = score + 5\nshow score`,
  },
  {
    name: 'Spanish (Español)',
    style: 'natural-es',
    code: `Tengo un número llamado score. Es 10.\nSumar 5 a score.\nSi score es mayor que 10, mostrar "¡Ganaste!".`,
  },
  {
    name: 'Yoruba Dialect',
    style: 'natural-yo',
    code: `Mo ní nọ́mbà kan tí à ń pè ní score. Ó jẹ́ 10.\nFi 5 kún score.\nFi score hàn.`,
  },
  {
    name: 'Repetition Loop',
    style: 'natural-en',
    code: `Do this 3 times: show "Hello NP-LANG!".`,
  },
];

const TASKS = [
  {
    id: 1,
    title: 'Task 1: Display a Message',
    prompt: 'Make the computer show "Hello NP-LANG".',
    targetOutput: 'Hello NP-LANG',
  },
  {
    id: 2,
    title: 'Task 2: Create and Mutate',
    prompt: 'Create a number called score with value 10, add 5 to it, and show the result.',
    targetOutput: '15',
  },
  {
    id: 3,
    title: 'Task 3: Make a Decision',
    prompt: 'Create score with 25. If score is greater than 20, show "Winner".',
    targetOutput: 'Winner',
  },
];

export default function App() {
  const [currentStyle, setCurrentStyle] = useState<TabStyle>('natural-en');
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'trace' | 'state'>('console');

  // Usability research survey state
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [preferredStyle, setPreferredStyle] = useState<string>('natural-en');
  const [verbosityFeeling, setVerbosityFeeling] = useState<string>('just-right');
  const [wouldUseReal, setWouldUseReal] = useState<string>('yes');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Run the code
  const handleRun = () => {
    const start = performance.now();
    try {
      const res = runNplang(code);
      const elapsed = Math.round((performance.now() - start) * 100) / 100;
      setResult(res);
      setExecutionTimeMs(elapsed);
    } catch (err: any) {
      setResult({
        success: false,
        output: [],
        trace: [],
        variables: {},
        errors: [{ line: 1, column: 1, message: err.message, severity: 'error' }],
      });
      setExecutionTimeMs(0);
    }
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  // Handle switching style tabs (bidirectional translation)
  const handleStyleSwitch = (target: TabStyle) => {
    if (target === currentStyle) return;

    try {
      const translated = translateSource(code, target as OutputTarget);
      setCode(translated);
      setCurrentStyle(target);
      setTranslationNotice(`Automatically projected to ${getStyleLabel(target)}`);
      setTimeout(() => setTranslationNotice(null), 3000);
    } catch {
      // If code currently has syntax errors and cannot be parsed cleanly, just switch mode
      setCurrentStyle(target);
    }
  };

  const getStyleLabel = (s: TabStyle) => {
    switch (s) {
      case 'natural-en':
        return 'Natural English';
      case 'concise':
        return 'Concise Code';
      case 'natural-es':
        return 'Spanish (Español)';
      case 'natural-yo':
        return 'Yoruba Dialect';
      case 'ai-ast':
        return 'AI Canonical AST (JSON)';
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = {
      preferredStyle,
      verbosityFeeling,
      wouldUseReal,
      feedbackNotes,
      timestamp: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('nplang_user_feedback') || '[]');
      existing.push(feedbackData);
      localStorage.setItem('nplang_user_feedback', JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save to local storage', err);
    }
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg shadow-emerald-500/10">
            NP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">NP-LANG</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                v0.1 Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400">Natural Programming Language Playground</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Examples:
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => {
                setCode(ex.code);
                setCurrentStyle(ex.style);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="hidden sm:inline bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
            Shortcut: <kbd className="text-slate-200 font-mono">Ctrl+Enter</kbd>
          </span>
        </div>
      </header>

      {/* Style Projection Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Writing Style:
          </span>
          {(['natural-en', 'concise', 'natural-es', 'natural-yo', 'ai-ast'] as TabStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => handleStyleSwitch(style)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                currentStyle === style
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {style === 'natural-en' && '🇬🇧 Natural English'}
              {style === 'concise' && '⚡ Concise Code'}
              {style === 'natural-es' && '🇪🇸 Spanish (Español)'}
              {style === 'natural-yo' && '🇳🇬 Yoruba Dialect'}
              {style === 'ai-ast' && '🤖 AI Canonical AST'}
            </button>
          ))}
        </div>

        {translationNotice && (
          <div className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded animate-fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {translationNotice}
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Editor Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-300">Editor ({getStyleLabel(currentStyle)})</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setCode('');
                  setResult(null);
                }}
                className="text-xs px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                title="Reset editor"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
              <button
                onClick={handleRun}
                className="text-xs font-semibold px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Run Program
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex">
            {/* Simple Line Numbers */}
            <div className="w-10 py-4 bg-slate-900/30 text-slate-600 text-right pr-2 text-xs font-mono select-none border-r border-slate-800/40">
              {code.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your NP-LANG program here..."
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-emerald-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed selection:bg-emerald-800/60"
            />
          </div>

          {/* Guided Usability Tasks */}
          <div className="border-t border-slate-800 bg-slate-900/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" /> Usability Test Tasks
              </span>
              <span className="text-[11px] text-slate-500">Click a task to test yourself</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TASKS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`p-2 rounded text-left text-xs border transition ${
                    selectedTask === task.id
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{task.prompt}</div>
                  {result && result.output.includes(task.targetOutput) && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Passed
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output & Trace Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/40">
          {/* Output Sub-Tabs */}
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('console')}
                className={`text-xs px-3 py-1 rounded transition flex items-center gap-1.5 ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Output
              </button>
              <button
                onClick={() => setActiveTab('trace')}
                className={`text-xs px-3 py-1 rounded transition flex items-center gap-1.5 ${
                  activeTab === 'trace'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> What Happened?
              </button>
              <button
                onClick={() => setActiveTab('state')}
                className={`text-xs px-3 py-1 rounded transition flex items-center gap-1.5 ${
                  activeTab === 'state'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Variables
              </button>
            </div>

            {executionTimeMs !== null && (
              <span className="text-[11px] text-slate-400 font-mono">
                {executionTimeMs}ms
              </span>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
            {activeTab === 'console' && (
              <div>
                {!result ? (
                  <div className="text-slate-500 italic py-8 text-center font-sans">
                    Click "Run Program" or press Ctrl+Enter to execute.
                  </div>
                ) : result.errors.length > 0 ? (
                  <div className="space-y-3 font-sans">
                    {result.errors.map((err, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-red-200"
                      >
                        <div className="flex items-center gap-2 font-semibold text-red-400 mb-1">
                          <AlertCircle className="w-4 h-4" /> Error on line {err.line}
                        </div>
                        <p className="text-sm">{err.message}</p>
                        {err.suggestion && (
                          <div className="mt-2 text-xs bg-red-900/30 p-2 rounded text-red-300 border border-red-800/40">
                            💡 <strong>Tip:</strong> {err.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-slate-500 text-[11px]">=== Program Output ===</div>
                    {result.output.length === 0 ? (
                      <div className="text-slate-400 italic font-sans">
                        Program completed with no display output. (Use "Show ..." to print values).
                      </div>
                    ) : (
                      result.output.map((out, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-sm"
                        >
                          {out}
                        </div>
                      ))
                    )}
                    <div className="mt-4 pt-2 border-t border-slate-800/60 text-slate-500 text-[11px] flex items-center justify-between">
                      <span className="text-emerald-400 font-sans flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Program completed successfully
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'trace' && (
              <div className="font-sans space-y-3">
                {!result || result.trace.length === 0 ? (
                  <div className="text-slate-500 italic py-8 text-center">
                    Execute a program to see step-by-step human explanations of how each line ran.
                  </div>
                ) : (
                  result.trace.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3 rounded bg-slate-900/80 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="font-semibold text-emerald-400">Step {step.stepNumber}</span>
                        {step.line && <span>Line {step.line}</span>}
                      </div>
                      <p className="text-slate-200 text-sm font-medium">{step.description}</p>
                      <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded">
                        {step.codeSnippet}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'state' && (
              <div className="font-sans">
                {!result || Object.keys(result.variables).length === 0 ? (
                  <div className="text-slate-500 italic py-8 text-center">
                    No active variables in memory.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          <th className="p-2 font-medium">Variable</th>
                          <th className="p-2 font-medium">Type</th>
                          <th className="p-2 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.variables).map(([name, val]) => (
                          <tr key={name} className="border-b border-slate-800/60 font-mono">
                            <td className="p-2 text-emerald-400 font-bold">{name}</td>
                            <td className="p-2 text-slate-400">{typeof val}</td>
                            <td className="p-2 text-slate-100">{JSON.stringify(val)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Testing Feedback Survey Card */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 font-sans">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Usability Feedback
              </span>
              <span className="text-[11px] text-slate-500">Help shape NP-LANG</span>
            </div>

            {feedbackSubmitted ? (
              <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-center">
                ✨ Thank you! Your feedback has been recorded locally to inform the language design.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Which style felt best to you?</label>
                  <select
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="natural-en">Natural English ("I have a number called score...")</option>
                    <option value="concise">Concise Code ("let score = 10")</option>
                    <option value="natural-es">Spanish ("Tengo un número...")</option>
                    <option value="natural-yo">Yoruba Dialect ("Mo ní nọ́mbà...")</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Did full sentences feel too long?</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="verbosity"
                        value="too-long"
                        checked={verbosityFeeling === 'too-long'}
                        onChange={(e) => setVerbosityFeeling(e.target.value)}
                      />
                      <span>Too long</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="verbosity"
                        value="just-right"
                        checked={verbosityFeeling === 'just-right'}
                        onChange={(e) => setVerbosityFeeling(e.target.value)}
                      />
                      <span>Just right</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="verbosity"
                        value="very-intuitive"
                        checked={verbosityFeeling === 'very-intuitive'}
                        onChange={(e) => setVerbosityFeeling(e.target.value)}
                      />
                      <span>Very intuitive</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Would you use NP-LANG for a real project?</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="wouldUse"
                        value="yes"
                        checked={wouldUseReal === 'yes'}
                        onChange={(e) => setWouldUseReal(e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="wouldUse"
                        value="maybe"
                        checked={wouldUseReal === 'maybe'}
                        onChange={(e) => setWouldUseReal(e.target.value)}
                      />
                      <span>Maybe</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="wouldUse"
                        value="no"
                        checked={wouldUseReal === 'no'}
                        onChange={(e) => setWouldUseReal(e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Any thoughts or suggestions for the compiler?"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition text-center"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
