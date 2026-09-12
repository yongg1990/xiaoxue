import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { HomeworkGrade, HomeworkSubject } from '../types';
import { sound } from '../utils/speech';

interface HomeworkPasswordModalProps {
  isOpen: boolean;
  targetGrade: HomeworkGrade;
  targetSubject: HomeworkSubject;
  targetUnit: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const GRADE_LABELS: Record<HomeworkGrade, string> = {
  '3': '三年级上册',
  '4': '四年级上册',
  '5': '五年级上册',
  '6': '六年级上册',
};

const SUBJECT_LABELS: Record<HomeworkSubject, string> = {
  chinese: '语文',
  math: '数学',
  english: '英语',
};

/**
 * Subject coefficient mapping:
 * 语文: 1.1
 * 数学: 2.2
 * 英语: 3.3
 */
const SUBJECT_FACTORS: Record<HomeworkSubject, number> = {
  chinese: 1.1,
  math: 2.2,
  english: 3.3,
};

/**
 * Calculates the expected password:
 * 年级数 * 学科系数 * 单元数
 */
export const calculateHomeworkExpectedPassword = (
  grade: HomeworkGrade,
  subject: HomeworkSubject,
  unit: number
): number => {
  const gradeNum = parseInt(grade, 10);
  const factor = SUBJECT_FACTORS[subject] || 1.1;
  const unitNum = unit;
  return Math.round(gradeNum * factor * unitNum * 1000) / 1000;
};

/**
 * Verifies whether user's input matches the formula without exposing any hints
 */
export const verifyHomeworkInput = (
  input: string,
  grade: HomeworkGrade,
  subject: HomeworkSubject,
  unit: number
): boolean => {
  const expected = calculateHomeworkExpectedPassword(grade, subject, unit);
  const trimmed = input.trim();
  const val = parseFloat(trimmed);
  if (isNaN(val)) return false;
  return Math.abs(val - expected) < 0.001;
};

export const HomeworkPasswordModal: React.FC<HomeworkPasswordModalProps> = ({
  isOpen,
  targetGrade,
  targetSubject,
  targetUnit,
  onSuccess,
  onCancel,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset input and focus when opened or target changes
  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMessage('');
      setIsShaking(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetGrade, targetSubject, targetUnit]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const isValid = verifyHomeworkInput(passwordInput, targetGrade, targetSubject, targetUnit);

    if (isValid) {
      sound.playCorrect();
      setErrorMessage('');
      onSuccess();
    } else {
      sound.playWrong();
      setErrorMessage('密码错误，请重新输入');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setPasswordInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <div
      id="homework-password-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        className={`bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#dde9ff] overflow-hidden transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006780] to-[#0284c7] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                作业生成密码验证
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                请输入密码后生成并开始作业
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="关闭（不生成作业）"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Target details banner without any hints */}
          <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-3 flex items-center justify-between text-xs text-[#0369a1]">
            <span className="font-semibold text-[#514532]">生成作业目标：</span>
            <span className="font-extrabold bg-white px-2.5 py-1 rounded-xl border border-[#cbd5e1] text-[#0f172a] shadow-2xs">
              {GRADE_LABELS[targetGrade]} · {SUBJECT_LABELS[targetSubject]} · 第 {targetUnit} 单元
            </span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="hw-password-input"
              className="block text-xs font-bold text-[#334155]"
            >
              验证密码
            </label>
            <div className="relative">
              <input
                id="hw-password-input"
                ref={inputRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="请输入密码"
                className={`w-full px-4 py-3 rounded-xl text-base font-bold bg-[#f8fafc] border transition-all focus:outline-none focus:ring-2 ${
                  errorMessage
                    ? 'border-[#ef4444] focus:ring-[#ef4444] text-[#ef4444] bg-[#fff1f2]'
                    : 'border-[#cbd5e1] focus:ring-[#006780] focus:bg-white text-[#0f172a]'
                }`}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-[#e11d48] font-bold pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm font-bold text-[#475569] hover:bg-[#f1f5f9] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>关闭（暂不生成）</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#006780] hover:bg-[#005266] text-white text-xs sm:text-sm font-extrabold active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>确认生成作业</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
