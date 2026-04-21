import React, { useState, useEffect } from 'react';
import { 
  MapPin, Dumbbell, ChevronDown, Menu, X, CheckCircle2, 
  ArrowRight, Clock, Phone, Send, Loader2, Eye, Star, Quote, Building2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// --- DATA ---
const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Success starts with self-discipline.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Sore today, strong tomorrow."
];

const branches = [
  {
    id: 'kghalli',
    name: 'Oxygen Gym - KG Halli',
    shortName: 'KG Halli',
    address: 'KG Halli, Bengaluru, Karnataka',
    phone: '+91 63603 67717',
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=KG+Halli,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'Premium facilities, elite trainers, and a community driven by results at KG Halli.',
    amenities: ['Cardio Deck', 'Free Weights Area', 'Strength Machines', 'Crossfit Area', 'Unisex Facility', 'Advanced Equipment', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Personal Training'],
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600',
      'https://images.unsplash.com/photo-1574673130244-c747e9659b5b?q=80&w=600'
    ],
    trainers: [
      { specialty: 'Bodybuilding Elite', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=400' },
      { specialty: 'Functional Training', image: 'https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=400' }
    ]
  },
  {
    id: 'lingarajapuram',
    name: 'Oxygen Gym - Lingarajapuram',
    shortName: 'Lingarajapuram',
    address: 'Main Road, Lingarajapuram, Bengaluru, Karnataka',
    phone: '+91 63603 67717',
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=Lingarajapuram,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'Premium facilities, elite trainers, and a community driven by results at Lingarajapuram.',
    amenities: ['Cardio Deck', 'Free Weights Area', 'Strength Machines', 'Crossfit Area', 'Unisex Facility', 'Advanced Equipment', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Personal Training'],
    gallery: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600',
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600'
    ],
    trainers: [
      { specialty: 'Powerlifting Coach', image: 'https://images.unsplash.com/photo-149175235542e-00bd22e672a9?q=80&w=400' },
      { specialty: 'Yoga & Pilates', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400' }
    ]
  },
  {
    id: 'lrbande',
    name: 'Oxygen Gym - LR Bande',
    shortName: 'LR Bande',
    address: 'LR Bande Main Rd, Bengaluru, Karnataka',
    phone: '+91 63603 67717 / +91 83108 85207',
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=LR+Bande+Main+Rd,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'A premium, luxurious gym fully equipped with advanced premier machines.',
    amenities: ['Advanced Premier Machines', 'Premium Luxurious Gym', 'Cardio Deck', 'Free Weights Area', 'Crossfit Area', 'Unisex Facility', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Personal Training'],
    gallery: [
      'https://images.unsplash.com/photo-1590239068512-63276022ce3d?q=80&w=600',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=600',
      'https://images.unsplash.com/photo-1596357399117-572344243673?q=80&w=600',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600'
    ],
    trainers: [
      { specialty: 'Master Trainer', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400' },
      { specialty: 'Nutrition Expert', image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=400' }
    ]
  }
];

const testimonials = [
  { name: 'Arjun K.', text: 'The equipment here is world-class. I love the double categories of weights.', rating: 5 },
  { name: 'Meera S.', text: 'Best unisex gym in Bengaluru. Extremely spacious and professional.', rating: 5 }
];

const pricingPlans = [
  { name: 'Monthly', price: '1,500', originalPrice: '1,999', duration: '1 Month', features: ['Full Gym Access', 'Cardio Equipment', 'Resistance Training'] },
  { name: 'Half-Yearly', price: '3,000', originalPrice: '3,500', duration: '6 Months', features: ['Full Gym Access', 'All Services', 'Diet Plan'] },
  { name: 'Yearly', price: '5,000', originalPrice: '8,999', duration: '12 Months', features: ['Full Gym Access', 'All Services', 'PT Consultation'], popular: true }
];

export default function App() {
  const [activeBranch, setActiveBranch] = useState(branches[0]);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [currentQuote, setCurrentQuote] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', goal: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyAkhR7kCXMbsWji0fwaA-szt_4pYS_KCwY",
        authDomain: "oxygen-gym-website-eb697.firebaseapp.com",
        projectId: "oxygen-gym-website-eb697",
        storageBucket: "oxygen-gym-website-eb697.firebasestorage.app",
        messagingSenderId: "948871457854",
        appId: "1:948871457854:web:0b97806358ea74577a356f"
      };
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      setDb(getFirestore(app));
      signInAnonymously(auth).then(() => {
        onAuthStateChanged(auth, setUser);
      });
    } catch (e) {
      console.error("Firebase init failed:", e);
    }
  }, []);

  const handleBranchChange = (branch) => {
    setActiveBranch(branch);
    setIsBranchMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    setFormStatus({ loading: true, success: false, error: null });
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        branch: activeBranch.name,
        date: new Date().toISOString()
      });
      setFormStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', phone: '', goal: '' });
      setTimeout(() => setFormStatus(s => ({ ...s, success: false })), 5000);
    } catch (err) {
      setFormStatus({ loading: false, success: false, error: 'Submission failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-yellow-400/30 overflow-x-hidden">
      
      {/* GLOBAL GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-400/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* NAV */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-2 bg-yellow-400/10 rounded-xl group-hover:bg-yellow-400 transition-all duration-300">
              <Dumbbell className="w-7 h-7 text-yellow-400 group-hover:text-black transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase text-white leading-none">OXYGEN <span className="text-yellow-400">GYM</span></span>
              <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-zinc-500 mt-1">Multi-Location Premium Fitness</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-zinc-400">
             <a href="#branches" className="hover:text-yellow-400 transition-colors">LOCATIONS</a>
             <a href="#services" className="hover:text-white transition-colors">Services</a>
             <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
             <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
             
             <div className="relative">
              <button onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)} className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2 text-white hover:bg-white/10 transition-all">
                <MapPin className="w-3 h-3 text-yellow-400" /> {activeBranch.shortName}
                <ChevronDown className={`w-3 h-3 transition-transform ${isBranchMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBranchMenuOpen && (
                <div className="absolute top-full mt-3 right-0 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-top-2">
                  {branches.map(b => (
                    <button key={b.id} onClick={() => handleBranchChange(b)} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${activeBranch.id === b.id ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-white/5 text-zinc-400'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <a href="#enquiry" className="hidden sm:block bg-yellow-400 text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">JOIN NOW</a>
             <button className="lg:hidden p-2 bg-white/5 rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950 p-6 flex flex-col gap-8 pt-24 animate-in fade-in duration-300">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full"><X /></button>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 mb-6">Navigation</p>
            <a href="#branches" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black block">LOCATIONS</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black block">SERVICES</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black block">GALLERY</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black block">PRICING</a>
          </div>
          <div className="mt-auto">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 mb-4">Switch Branch</p>
             <div className="grid grid-cols-1 gap-2">
               {branches.map(b => (
                 <button key={b.id} onClick={() => handleBranchChange(b)} className={`p-4 rounded-xl text-left font-bold border transition-all ${activeBranch.id === b.id ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                   {b.name}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={activeBranch.heroImage} className="w-full h-full object-cover opacity-40 transition-opacity duration-700 grayscale-[0.3]" alt="Gym" key={activeBranch.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Building2 className="w-3 h-3" /> Branch: {activeBranch.shortName}
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8 uppercase">
            REDEFINE <br /> <span className="text-yellow-400 italic">LIMITS.</span>
          </h1>
          <div className="max-w-2xl border-l-4 border-yellow-400 pl-6 py-2 mb-8 bg-white/5 backdrop-blur-sm rounded-r-2xl animate-in slide-in-from-left duration-700">
            <p className="text-xl md:text-3xl font-medium italic text-white leading-tight">"{currentQuote}"</p>
          </div>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-xl mb-12 font-light">{activeBranch.description}</p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a href="#pricing" className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 group transition-all hover:scale-105 shadow-xl">
              VIEW MEMBERSHIPS <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#branches" className="bg-white/5 border border-white/10 px-10 py-5 rounded-full font-bold text-lg text-center backdrop-blur-xl hover:bg-white/10 transition-all">All Locations</a>
          </div>
        </div>
      </section>

      {/* BRANCHES GRID - THE MULTI-BRANCH FOCUS */}
      <section id="branches" className="py-24 px-4 bg-zinc-900/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">OUR NETWORK</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Find Your <br/><span className="text-zinc-500">Nearest Branch</span></h2>
            </div>
            <p className="text-zinc-400 max-w-md font-medium text-sm leading-relaxed mb-1">We operate three premium facilities across Bengaluru. Select a branch to view specific schedules, equipment, and trainers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {branches.map(b => (
              <div 
                key={b.id} 
                onClick={() => handleBranchChange(b)}
                className={`group relative rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${activeBranch.id === b.id ? 'border-yellow-400 shadow-2xl scale-105' : 'border-white/5 hover:border-yellow-400/50'}`}
              >
                <div className="absolute inset-0 z-0">
                  <img src={b.heroImage} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" alt={b.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                </div>
                <div className="relative z-10 p-8 pt-40">
                  <h3 className="text-2xl font-black uppercase mb-2">{b.shortName}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-6 group-hover:text-white transition-colors">
                    <MapPin className="w-3 h-3 text-yellow-400" /> {b.address.split(',')[0]}
                  </div>
                  <button className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeBranch.id === b.id ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white group-hover:bg-yellow-400 group-hover:text-black'}`}>
                    {activeBranch.id === b.id ? 'Currently Viewing' : 'Switch to Branch'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES & MAP */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">ACTIVE BRANCH: {activeBranch.shortName.toUpperCase()}</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase tracking-tighter">PREMIUM <br/><span className="text-zinc-500">FACILITY</span></h2>
            <div className="flex flex-wrap gap-3 mb-10">
              {activeBranch.amenities.map((a, i) => (
                <div key={i} className="bg-zinc-900 border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" /> {a}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <MapPin className="text-yellow-400 shrink-0" /> <p className="text-sm font-medium">{activeBranch.address}</p>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <Clock className="text-yellow-400 shrink-0" /> <p className="text-sm font-medium">{activeBranch.hours}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl h-96 relative group">
            <iframe title="map" src={activeBranch.mapUrl} width="100%" height="100%" className="grayscale invert-[0.9] opacity-80 group-hover:opacity-100 transition-opacity" style={{border:0}} key={activeBranch.id}></iframe>
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-widest">{activeBranch.shortName} Base</span>
              <MapPin className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">PREVIEW {activeBranch.shortName.toUpperCase()}</span>
          <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Gym Gallery</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeBranch.gallery.map((img, i) => (
            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 group relative">
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery" />
              <div className="absolute inset-0 bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-8 h-8 text-black" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section id="trainers" className="py-24 px-4 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">OUR EXPERTS</span>
          <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Meet Our Team</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {activeBranch.trainers.map((t, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:bg-zinc-900 transition-colors">
              <img src={t.image} className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Trainer" />
              <div>
                <p className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Coach</p>
                <p className="text-lg font-black uppercase tracking-tighter text-white">{t.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase">Pricing Plans</h2>
          <p className="text-zinc-500 italic">Branch Selection: Oxygen {activeBranch.name.split(' - ')[1]}</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {pricingPlans.map((p, i) => (
            <div key={i} className={`p-10 rounded-[2.5rem] flex flex-col ${p.popular ? 'bg-yellow-400 text-black md:-translate-y-4 shadow-2xl scale-105' : 'bg-zinc-900 border border-white/5'}`}>
              <h3 className="text-xl font-black mb-6 uppercase tracking-widest">{p.name}</h3>
              <div className="text-5xl font-black mb-2">₹{p.price}</div>
              <div className="text-xs font-bold opacity-60 mb-8 uppercase tracking-widest">/{p.duration}</div>
              <ul className="space-y-4 mb-10 flex-grow">
                {p.features.map((f, fi) => <li key={fi} className="flex gap-4 text-sm font-bold uppercase"><CheckCircle2 className="w-5 h-5" /> {f}</li>)}
              </ul>
              <a href="#enquiry" className={`block text-center py-4 rounded-full font-black tracking-widest uppercase text-xs transition-all ${p.popular ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white/10 hover:bg-white/20'}`}>SELECT PLAN</a>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="enquiry" className="py-24 px-4">
        <div className="max-w-3xl mx-auto bg-zinc-900 p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px]"></div>
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Enquire</h2>
            <p className="text-xs font-black tracking-[0.4em] uppercase text-yellow-400 mt-2">Target Branch: {activeBranch.shortName}</p>
          </div>
          <form onSubmit={handleEnquirySubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl w-full text-white outline-none focus:border-yellow-400 font-bold placeholder:text-zinc-700" />
              <input type="tel" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl w-full text-white outline-none focus:border-yellow-400 font-bold placeholder:text-zinc-700" />
            </div>
            <textarea placeholder="Tell us your goals..." value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl w-full h-40 text-white outline-none focus:border-yellow-400 resize-none font-bold placeholder:text-zinc-700"></textarea>
            {formStatus.success && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-center font-bold animate-in slide-in-from-bottom">✓ Enquiry sent! Talk soon.</div>}
            <button type="submit" disabled={formStatus.loading} className="w-full bg-yellow-400 text-black py-5 rounded-full font-black tracking-widest text-lg uppercase transition-transform hover:scale-[0.99] shadow-2xl">
              {formStatus.loading ? <Loader2 className="animate-spin mx-auto" /> : 'SUBMIT ENQUIRY'}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-10">
            <Dumbbell className="text-yellow-400" />
            <span className="text-xl font-black uppercase">OXYGEN <span className="text-yellow-400">GYM</span></span>
          </div>

          <div className="mb-12">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8 opacity-60">Master Network Contact Details</h4>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
              <a href="tel:+916360367717" className="group">
                <div className="text-2xl md:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">63603 67717</div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Central Management - One</div>
              </a>
              <div className="hidden md:block w-px h-16 bg-white/10"></div>
              <a href="tel:+918310885207" className="group">
                <div className="text-2xl md:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">83108 85207</div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Central Management - Two</div>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left max-w-4xl mx-auto border-y border-white/5 py-12">
             {branches.map(b => (
               <div key={b.id}>
                 <p className="text-white font-black text-xs uppercase mb-2">{b.shortName}</p>
                 <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed">{b.address}</p>
               </div>
             ))}
          </div>

          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Oxygen Gym Bengaluru. All Rights Reserved.</p>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a href={`https://wa.me/${activeBranch.whatsapp}?text=Hi Oxygen Gym! I want to join ${activeBranch.shortName}.`} target="_blank" rel="noreferrer" className="fixed bottom-10 right-10 bg-[#25D366] text-white p-5 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] z-50 hover:scale-110 hover:-translate-y-2 transition-all duration-300 group">
        <svg className="w-8 h-8 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        <span className="absolute right-full mr-5 bg-zinc-900 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap translate-x-4 group-hover:translate-x-0">Chat With Oxygen {activeBranch.shortName}</span>
      </a>

    </div>
  );
}