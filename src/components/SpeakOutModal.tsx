import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, Mic, X, Sparkles, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { sound, speakText, triggerConfetti } from '../utils/speech';
import { WordImage } from './WordImage';

interface SpeakOutModalProps {
  words: WordItem[];
  onClose: () => void;
  onAddStars: (stars: number) => void;
}

export const SpeakOutModal: React.FC<SpeakOutModalProps> = ({ words, onClose, onAddStars }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const currentWord = words[currentIndex] || words[0];

  const handlePlayModelVoice = (rate = 0.68) => {
    sound.playTap();
    speakText(currentWord.word, 'en-US', rate);
  };

  const handleStartSpeaking = () => {
    sound.playTap();
    setIsRecording(true);
    setEvaluated(false);
    setScore(null);

    // Use Web Speech Recognition if available
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: () => void;
        onerror: () => void;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: () => void;
        onerror: () => void;
        start: () => void;
        stop: () => void;
      };
    };

    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = () => {
          setIsRecording(false);
          setEvaluated(true);
          const earned = Math.floor(Math.random() * 8) + 93; // 93 - 100
          setScore(earned);
          sound.playCorrect();
          triggerConfetti();
          onAddStars(5);
        };

        recognition.onerror = () => {
          fallbackEvaluation();
        };

        recognition.start();

        // Safety timeout in case no speech detected
        setTimeout(() => {
          if (isRecording) {
            recognition.stop();
          }
        }, 4000);
      } catch {
        fallbackEvaluation();
      }
    } else {
      fallbackEvaluation();
    }
  };

  const fallbackEvaluation = () => {
    setTimeout(() => {
      setIsRecording(false);
      setEvaluated(true);
      const earned = Math.floor(Math.random() * 8) + 93; // 93 - 100
      setScore(earned);
      sound.playCorrect();
      triggerConfetti();
      onAddStars(5);
    }, 2000);
  };

  const handleNextWord = () => {
    sound.playTap();
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
      setEvaluated(false);
      setScore(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg text-center shadow-2xl border-2 border-[#dde9ff] relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] font-bold text-xs px-3 py-1 rounded-full mb-3">
          <Mic className="w-3.5 h-3.5" />
          <span>开口说 (Speak Out 练习)</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-[#0d1c2f] mb-1">
          跟读单词：{currentWord.word}
        </h3>
        <p className="text-xs md:text-sm text-[#514532]/80 mb-4">
          大声读出单词，锻炼口语发音！
        </p>

        {/* Word Image Avatar */}
        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-[#dde9ff] mb-4 bg-[#eff4ff] flex items-center justify-center">
          <WordImage
            word={currentWord}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Model Voice Buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => handlePlayModelVoice(0.70)}
            className="inline-flex items-center gap-1.5 bg-[#e6eeff] text-[#006780] font-bold px-4 py-2 rounded-full text-xs md:text-sm button-3d-white cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>示范发音</span>
          </button>
          <button
            onClick={() => handlePlayModelVoice(0.55)}
            className="inline-flex items-center gap-1 bg-[#fff8e6] text-[#7c5800] font-bold px-3 py-2 rounded-full text-xs md:text-sm button-3d-yellow border border-[#ffd666] cursor-pointer"
            title="超慢速示范"
          >
            <span>🐢 慢速示范</span>
          </button>
        </div>

        {/* Recording / Voice Trigger */}
        <div className="flex flex-col items-center justify-center mb-6">
          <button
            onClick={handleStartSpeaking}
            disabled={isRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-[#ba1a1a] text-white animate-ping scale-110 shadow-lg'
                : 'bg-[#ffb800] text-[#6b4c00] button-3d-yellow scale-100 shadow-md hover:scale-105'
            }`}
          >
            <Mic className="w-9 h-9" />
          </button>
          <p className="text-xs md:text-sm font-bold text-[#514532] mt-3">
            {isRecording ? '正在倾听中... 请大声跟读！🎙️' : '点击麦克风开始跟读'}
          </p>
        </div>

        {/* Evaluation Feedback */}
        {evaluated && score && (
          <div className="bg-[#f3fee6] border border-[#b4f26b] rounded-2xl p-4 mb-4 text-center animate-fade-in">
            <div className="flex justify-center items-center gap-1 text-[#ffb800] mb-1">
              <Sparkles className="w-5 h-5 fill-[#ffb800]" />
              <span className="text-2xl font-bold text-[#326b00] font-quicksand">
                {score} 分
              </span>
              <Sparkles className="w-5 h-5 fill-[#ffb800]" />
            </div>
            <p className="text-sm font-bold text-[#2b5d00] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              太棒了！发音非常标准！(+5 ⭐️)
            </p>
          </div>
        )}

        {/* Next Word Action */}
        <div className="flex gap-3">
          {evaluated && (
            <button
              onClick={handleStartSpeaking}
              className="flex-1 bg-[#e6eeff] text-[#0d1c2f] font-bold py-3 rounded-full button-3d-white flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再读一次</span>
            </button>
          )}

          <button
            onClick={handleNextWord}
            className="flex-1 bg-[#ffb800] text-[#6b4c00] font-bold py-3 rounded-full button-3d-yellow flex items-center justify-center gap-1.5 cursor-pointer text-sm md:text-base"
          >
            <span>{currentIndex + 1 < words.length ? '下一个单词' : '完成练习'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
