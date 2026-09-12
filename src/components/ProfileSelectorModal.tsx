import React, { useState } from 'react';
import { StudentProfile, GradeLevel, SemesterType } from '../types';
import { CheckCircle2, UserPlus, Play, X, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/speech';

interface ProfileSelectorProps {
  students: StudentProfile[];
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (
    newStudent: Omit<
      StudentProfile,
      | 'id'
      | 'streakDays'
      | 'totalStars'
      | 'wordsMastered'
      | 'completedQuizzesCount'
      | 'badgesUnlocked'
      | 'dailyGoal'
      | 'todayProgress'
    >
  ) => void;
  onClose?: () => void;
}

const AVATAR_OPTIONS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1yEJKjxqMMwP5WUXwNsIEvpMLyOF1NHIveRTq48KtUS8egvOUcesuXBDyfMNEXha_zwj_SE-95-sznTS0-V9Iag4KND1yMR8LarvXvQemYAzEvfJY6SGNKmOd54RjQvZwlxNM3GVELYomXfX7zSZVZR8hztXCqSANpckg5SVjMWEQ3BxMwaQlzlQo0oKyVcDmUiAyfdtHeCKGkIMWIySAmXP6htkh-xb_6AIEb-_q0Q7PSvsjNydGUw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4KcLtBjSp-QoR0gHKngEuG1I33j2rl4TDhQTKQCxbLEJrEYKMz8Vw-m1bUAL4L5ImGy7q_UirKL826pUxiuBKFvXHYQXFjX1lRFyV7WazCzYxiv385uC2uFrdr_94MSazZf4sSB8MvWkUlt7EYbK8GzvzvPVxbD7KNVFBG63594VBtKXrPyu9j7js8dpH8JB7jO9pGiQvhPLd9hA3XPG-0rC5Ga3ESTtns2_KOEbTfPr21eEbNjxZwQ',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
];

export const ProfileSelectorModal: React.FC<ProfileSelectorProps> = ({
  students,
  currentStudentId,
  onSelectStudent,
  onAddStudent,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentStudentId);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newChineseName, setNewChineseName] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState<GradeLevel>('3');
  const [newSemester, setNewSemester] = useState<SemesterType>('A');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleConfirm = () => {
    sound.playTap();
    onSelectStudent(selectedId);
    if (onClose) onClose();
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sound.playCorrect();

    const gradeLabels: Record<GradeLevel, string> = {
      '3': '三年级 (Grade 3)',
      '4': '四年级 (Grade 4)',
      '5': '五年级 (Grade 5)',
      '6': '六年级 (Grade 6)',
    };

    onAddStudent({
      name: newName.trim(),
      chineseName: newChineseName.trim() || newName.trim(),
      grade: `${gradeLabels[newGradeLevel]} ${newSemester === 'A' ? '上册' : '下册'}`,
      gradeLevel: newGradeLevel,
      semester: newSemester,
      avatar: selectedAvatar,
    });
    setNewName('');
    setNewChineseName('');
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9ff] overflow-y-auto flex flex-col items-center justify-between p-6 md:p-12">
      {onClose && (
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-6 right-6 p-3 rounded-full bg-[#e6eeff] text-[#514532] hover:bg-[#dde9ff] transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Header Section */}
      <div className="text-center w-full max-w-xl mt-4 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#7c5800] mb-2 leading-tight">
          Who is learning? <br />
          <span className="text-[#006780] text-xl md:text-2xl font-bold">
            选择学生档案 (PEP 2024新版)
          </span>
        </h1>
        <p className="text-base md:text-lg text-[#514532]/90 mt-2">
          选择你的学习档案，开始三至六年级人教版英语词汇探险！
        </p>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl my-8">
        {students.map((student) => {
          const isSelected = selectedId === student.id;
          return (
            <button
              key={student.id}
              onClick={() => {
                sound.playTap();
                setSelectedId(student.id);
              }}
              className={`relative rounded-[2rem] p-5 flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer min-h-[210px] ${
                isSelected
                  ? 'bg-[#dde9ff] border-2 border-[#7c5800] shadow-[0px_8px_24px_0px_rgba(124,88,0,0.18)] scale-[1.02]'
                  : 'bg-white border-2 border-[#e6eeff] shadow-[0px_4px_20px_0px_rgba(0,103,128,0.06)] hover:border-[#5ed8ff]'
              }`}
            >
              {/* Checkmark icon */}
              <div
                className={`absolute top-3.5 right-3.5 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 text-[#7c5800] fill-[#ffb800]" />
              </div>

              {/* Avatar image */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#dde9ff] bg-[#d5e3fd] shadow-sm">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Chinese Name */}
              <div className="text-center">
                <h2 className="text-lg md:text-xl font-bold text-[#0d1c2f]">
                  {student.name}
                </h2>
                {student.chineseName && (
                  <p className="text-xs text-[#514532]/80 font-medium">
                    {student.chineseName}
                  </p>
                )}
              </div>

              {/* Grade & Semester Pill */}
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffb800]/20 text-[#7c5800] border border-[#ffd666]">
                {student.grade || '三年级 上册'}
              </span>
            </button>
          );
        })}

        {/* Add New Student Card */}
        <button
          onClick={() => {
            sound.playTap();
            setShowAddModal(true);
          }}
          className="bg-transparent border-2 border-dashed border-[#d5c4ab] hover:border-[#7c5800] rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 transition-all hover:bg-[#eff4ff] cursor-pointer min-h-[210px] group"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-transparent bg-[#d5e3fd] text-[#514532] group-hover:scale-105 transition-transform">
            <UserPlus className="w-8 h-8 text-[#006780]" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#514532]">添加新学生</h2>
          <span className="text-xs font-bold text-[#514532]/70">
            Add Student
          </span>
        </button>
      </div>

      {/* Confirm Action Button */}
      <div className="w-full max-w-sm pb-6">
        <button
          onClick={handleConfirm}
          className="w-full bg-[#ffb800] text-[#6b4c00] font-bold text-lg md:text-xl rounded-full py-4 px-8 flex items-center justify-center gap-2 button-3d-yellow cursor-pointer shadow-[0px_10px_30px_0px_rgba(124,88,0,0.2)]"
        >
          <span>进入学习 (Start Learning)</span>
          <Play className="w-5 h-5 fill-[#6b4c00]" />
        </button>
      </div>

      {/* Add New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border-2 border-[#e6eeff]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#7c5800] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#ffb800]" />
                添加新学生档案
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#514532] mb-1">
                  英文名 (English Name)
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如: Leo, Sarah, Mike, Amy..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#dde9ff] focus:border-[#ffb800] outline-none text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#514532] mb-1">
                  中文名 (Chinese Name)
                </label>
                <input
                  type="text"
                  value={newChineseName}
                  onChange={(e) => setNewChineseName(e.target.value)}
                  placeholder="例如: 里奥、小明、乐乐..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#dde9ff] focus:border-[#ffb800] outline-none text-base font-bold"
                />
              </div>

              {/* Grade & Semester Selection */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#514532] mb-1">
                    年级 (Grade)
                  </label>
                  <select
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-2xl border-2 border-[#dde9ff] focus:border-[#ffb800] outline-none text-sm font-bold bg-white"
                  >
                    <option value="3">三年级 (Grade 3)</option>
                    <option value="4">四年级 (Grade 4)</option>
                    <option value="5">五年级 (Grade 5)</option>
                    <option value="6">六年级 (Grade 6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#514532] mb-1">
                    学期 (Semester)
                  </label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value as SemesterType)}
                    className="w-full px-3 py-2 rounded-2xl border-2 border-[#dde9ff] focus:border-[#ffb800] outline-none text-sm font-bold bg-white"
                  >
                    <option value="A">上册 (Semester A)</option>
                    <option value="B">下册 (Semester B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#514532] mb-1.5">
                  选择萌趣头像 (Select Avatar)
                </label>
                <div className="flex gap-2.5 justify-center">
                  {AVATAR_OPTIONS.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedAvatar(imgUrl)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-3 transition-all ${
                        selectedAvatar === imgUrl
                          ? 'border-[#ffb800] scale-110 shadow-md'
                          : 'border-[#dde9ff] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="avatar option"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#ffb800] text-[#6b4c00] font-bold text-base py-3 rounded-full button-3d-yellow"
                >
                  创建档案并开启学习
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
