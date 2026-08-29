import { Bell, CheckCircle2, BookOpen, Home, Book, FileText, Star, Camera } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-[#FAF9F6] min-h-screen relative shadow-sm pb-24">
        
        <header className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-serif text-lg text-gray-700">
              S
            </div>
            <div>
              <p className="text-xs text-gray-500">Welcome back</p>
              <h1 className="text-lg font-bold text-gray-900">Sarah</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Lucas — Primary 2</span>
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
        </header>

        <div className="px-5 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-wider mb-1">PREPAID LESSON CREDITS</p>
                <p className="text-2xl font-bold text-gray-900">12 <span className="text-base font-normal text-gray-500">of 20 Remaining</span></p>
              </div>
              <button className="bg-[#1C4A3A] text-white px-4 py-2 rounded-xl text-sm font-medium">
                Top Up
              </button>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-2">
              <div className="bg-[#1C4A3A] h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-400">Credits expire on 30 Nov 2023</p>
          </div>
        </div>

        <div className="px-5 mb-8 flex gap-4">
          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex-1 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 tracking-wider">MASTERY RATE</p>
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">82.4%</p>
            <p className="text-xs text-green-500 font-medium">+2.5% this month</p>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex-1 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 tracking-wider">PRACTICED</p>
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">48 <span className="text-sm font-normal text-gray-500">Characters</span></p>
            <p className="text-xs text-gray-400 font-medium">Active learner</p>
          </div>
        </div>

        <div className="px-5">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Ting Xie</h2>
            <button className="text-sm font-medium text-gray-500">View All</button>
          </div>
          
          <div className="flex justify-between mb-6">
            {['12', '13', '14', '15', '16', '17'].map((day, idx) => {
              const isToday = day === '14';
              const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx];
              return (
                <div key={day} className={`flex flex-col items-center p-2 rounded-xl ${isToday ? 'border-2 border-gray-900' : ''}`}>
                  <span className="text-xs text-gray-400 mb-1">{dayName}</span>
                  <span className={`text-sm font-bold ${isToday ? 'text-gray-900' : 'text-gray-600'}`}>{day}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Week 4: 《第十课》 Spelling Test</h3>
              <p className="text-xs text-gray-500">Wednesday, 14 Oct at 3:00 PM • P2 MOE Syllabus</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-0 right-0 px-5">
          <Link href="/camera" className="w-full bg-[#1C4A3A] text-white flex items-center justify-center gap-2 py-4 rounded-full font-medium shadow-lg hover:bg-[#15382c] transition-colors">
            <Camera className="w-5 h-5" />
            Scan & Grade Worksheet
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 pb-6 px-6 flex justify-between items-center rounded-t-2xl">
          <div className="flex flex-col items-center text-[#1C4A3A]">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <Book className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Syllabus</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">History</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <Star className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Premium</span>
          </div>
        </div>

      </div>
    </div>
  );
}