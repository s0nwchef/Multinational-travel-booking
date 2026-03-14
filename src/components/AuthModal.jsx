import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Sun, Palmtree, Umbrella, Waves } from 'lucide-react';

const SummerElement = ({ children, className, delay = 0 }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 1, type: "spring" }}
        className={`absolute ${className}`}
    >
      {children}
    </motion.div>
);

const TravelBackground = () => (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#FFF9C4] via-[#FFECB3] to-[#FFE0B2]">
      {/* Sun */}
      <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: 360
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_60px_rgba(250,204,21,0.6)] flex items-center justify-center"
      >
        <div className="w-24 h-24 bg-yellow-300 rounded-full border-4 border-yellow-200/50" />
      </motion.div>

      {[...Array(4)].map((_, i) => (
          <motion.div
              key={i}
              className="absolute bg-white/60 blur-xl rounded-full"
              style={{
                width: 180 + i * 80,
                height: 60 + i * 15,
                top: 15 + i * 12 + '%',
                left: -15 + i * 25 + '%',
              }}
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
        <div className="absolute bottom-[-220px] left-[-10%] right-[-10%] h-[400px] bg-[#FFE082] rounded-[100%] border-t-8 border-[#FFD54F] shadow-[inset_0_20px_50px_rgba(0,0,0,0.05)]">

          {/* Summer Elements */}
          <SummerElement className="bottom-[205px] left-[15%]" delay={0.2}>
            <Palmtree className="text-emerald-600 w-16 h-16 drop-shadow-md" />
          </SummerElement>

          <SummerElement className="bottom-[215px] left-[30%]" delay={0.4}>
            <Umbrella className="text-orange-500 w-12 h-12 drop-shadow-md" />
          </SummerElement>

          <SummerElement className="bottom-[205px] right-[20%]" delay={0.6}>
            <div className="flex flex-col items-center">
              <Palmtree className="text-emerald-500 w-20 h-20 drop-shadow-md" />
            </div>
          </SummerElement>

          <SummerElement className="bottom-[220px] right-[35%]" delay={0.8}>
            <div className="w-10 h-10 bg-red-400 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              <div className="w-full h-2 bg-white rotate-45" />
              <div className="w-full h-2 bg-white -rotate-45 absolute" />
            </div>
          </SummerElement>
          <div className="absolute bottom-[180px] w-full flex justify-center opacity-30">
            <Waves className="text-blue-400 w-full h-12" />
          </div>
        </div>
      </div>
    </div>
);

const CustomInput = ({ label, icon: Icon, type = "text", placeholder, value, onChange, name }) => (
    <div className="relative mt-6">
      <label className="absolute -top-3 left-4 px-2 bg-[#FFF3E0] text-orange-600 text-xs font-semibold z-10">
        {label}
      </label>
      <div className="relative flex items-center bg-[#FFF3E0] border border-orange-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 transition-all">
        <div className="pl-4 pr-2 text-orange-400">
          <Icon size={18} />
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full py-3 pr-4 bg-transparent outline-none text-orange-900 placeholder-orange-300 text-sm"
        />
      </div>
    </div>
);

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isRegister) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === formData.email)) {
        alert('Email already exists');
        return;
      }
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        membership: 'Platinum Member',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'default'}`
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        alert('Invalid email or password');
        return;
      }
    }
    window.dispatchEvent(new Event('auth-change'));
    onClose();
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-4xl h-[620px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center"
              >
                <TravelBackground />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 text-orange-400 hover:text-orange-600 transition-colors"
                >
                  <X size={24} />
                </button>

                {/* Form Content */}
                <div className="relative z-10 w-full max-w-md mt-10 px-8 flex flex-col items-center">
                  <motion.h2
                      key={isRegister ? 'reg' : 'log'}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-script text-6xl text-orange-500 mb-1"
                  >
                    {isRegister ? 'Join Us' : 'Welcome'}
                  </motion.h2>
                  <p className="text-orange-400 text-xs font-bold mb-6 uppercase tracking-widest">
                    {isRegister ? 'Start Your Summer Adventure' : 'Login to Your Journey'}
                  </p>

                  <form className="w-full space-y-1" onSubmit={handleAuth}>
                    {isRegister && (
                        <CustomInput
                            label="Full Name"
                            icon={User}
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    )}
                    <CustomInput
                        label="Email Id"
                        icon={Mail}
                        name="email"
                        placeholder="wanderer@travel.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <CustomInput
                        label="Password"
                        icon={Lock}
                        name="password"
                        type="password"
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                    />

                    {!isRegister && (
                        <div className="flex justify-end mt-1">
                          <button type="button" className="text-[10px] text-orange-500 font-bold hover:underline">
                            Forgot your password?
                          </button>
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                      <button
                          type="submit"
                          className="bg-[#FF5B00] hover:bg-[#D64D00] text-white font-black py-3 px-14 rounded-xl shadow-[0_10px_20px_rgba(255,91,0,0.3)] transition-all uppercase text-sm tracking-widest"
                      >
                        {isRegister ? 'Register' : 'Login'}
                      </button>
                    </div>
                  </form>

                  <div className="w-full flex items-center gap-4 my-6">
                    <div className="flex-1 h-[1px] bg-orange-100" />
                    <span className="text-[10px] font-black text-orange-300">OR</span>
                    <div className="flex-1 h-[1px] bg-orange-100" />
                  </div>

                  {/* Social Login */}
                  <div className="flex gap-4">
                    {[
                      { icon: "https://www.svgrepo.com/show/355037/google.svg", name: "Google" },
                      { icon: "https://www.svgrepo.com/show/303114/facebook-3.svg", name: "Facebook" },
                      { icon: "https://www.svgrepo.com/show/303108/apple-black.svg", name: "Apple" }
                    ].map((social) => (
                        <button key={social.name} className="w-12 h-10 bg-white rounded-xl shadow-sm border border-orange-50 flex items-center justify-center hover:shadow-md hover:border-orange-200 transition-all">
                          <img src={social.icon} alt={social.name} className="w-5 h-5" />
                        </button>
                    ))}
                  </div>

                  {/* Footer Link */}
                  <div className="mt-8">
                    <p className="text-xs font-bold text-gray-700">
                      {isRegister ? 'Already an explorer?' : "New to the journey?"}{' '}
                      <button
                          onClick={() => setIsRegister(!isRegister)}
                          className="text-orange-600 hover:underline font-black"
                      >
                        {isRegister ? 'Login Now' : 'Register Now'}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
}
