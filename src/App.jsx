import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Dumbbell, 
  ChevronDown, 
  Menu, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Phone,
  Send,
  Loader2,
  Instagram,
  Star,
  Quote,
  MessageCircle
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
  "Don't stop when you're tired. Stop when you're done.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "A one-hour workout is 4% of your day. No excuses.",
  "Sore today, strong tomorrow.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Great things never come from comfort zones."
];

const branches = [
  {
    id: 'kghalli',
    name: 'Oxygen Gym - KG Halli',
    address: 'KG Halli, Bengaluru, Karnataka',
    phone: '+91 63603 67717',
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=KG+Halli,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'Premium facilities, elite trainers, and a community driven by results at KG Halli.',
    amenities: ['Cardio Deck', 'Free Weights Area', 'Strength Machines', 'Crossfit Area', 'Unisex Facility', 'Advanced Equipment', 'Fully Spacious', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Resistance Training', 'Personal Training', 'Diet Nutrition', 'Weight Control'],
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574673130244-c747e9659b5b?q=80&w=600&auto=format&fit=crop'
    ],
    trainers: [
      { specialty: 'Bodybuilding Elite', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=400&auto=format&fit=crop' },
      { specialty: 'Functional Training', image: 'https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: 'lingarajapuram',
    name: 'Oxygen Gym - Lingarajapuram',
    address: 'Main Road, Lingarajapuram, Bengaluru, Karnataka',
    phone: '+91 63603 67717',
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=Lingarajapuram,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'Premium facilities, elite trainers, and a community driven by results at Lingarajapuram.',
    amenities: ['Cardio Deck', 'Free Weights Area', 'Strength Machines', 'Crossfit Area', 'Unisex Facility', 'Advanced Equipment', 'Fully Spacious', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Resistance Training', 'Personal Training', 'Diet Nutrition', 'Weight Control'],
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600&auto=format&fit=crop'
    ],
    trainers: [
      { specialty: 'Powerlifting Coach', image: 'https://images.unsplash.com/photo-149175235542e-00bd22e672a9?q=80&w=400&auto=format&fit=crop' },
      { specialty: 'Yoga & Pilates', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: 'lrbande',
    name: 'Oxygen Gym - LR Bande',
    address: 'LR Bande Main Rd, Bengaluru, Karnataka',
    phone: '+91 63603 67717',
    secondaryPhones: ['+91 83108 85207', '+91 86180 38563'],
    whatsapp: '916360367717',
    hours: 'Mon-Sat: 6:00 AM - 11:45 PM',
    heroImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/maps?q=LR+Bande+Main+Rd,+Bengaluru,+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    description: 'A premium, luxurious gym fully equipped with advanced premier machines for an elite fitness experience at LR Bande.',
    amenities: ['Advanced Premier Machines', 'Premium Luxurious Gym', 'Cardio Deck', 'Free Weights Area', 'Crossfit Area', 'Unisex Facility', 'Fully Spacious', 'Double Equipment'],
    services: ['Cardio', 'Crossfit Friendly', 'Group Fitness', 'Resistance Training', 'Personal Training', 'Diet Nutrition', 'Weight Control'],
    gallery: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590239068512-63276022ce3d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596357399117-572344243673?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=600&auto=format&fit=crop'
    ],
    trainers: [
      { specialty: 'Master Trainer', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop' },
      { specialty: 'Nutrition Expert', image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=400&auto=format&fit=crop' }
    ]
  }
];

const testimonials = [
  { name: 'Arjun K.', text: 'The equipment here is world-class. I love the double categories of weights so I never have to wait.', rating: 5 },
  { name: 'Meera S.', text: 'Best unisex gym in Bengaluru. Extremely spacious and professional environment.', rating: 5 },
  { name: 'Faisal M.', text: 'The LR Bande branch is truly luxurious. The premier machines changed my workout game.', rating: 5 }
];

const pricingPlans = [
  { name: 'Monthly', price: '1,500', originalPrice: '1,999', duration: '1 Month', features: ['Full Gym Access', 'Cardio Equipment', 'Resistance Training'] },
  { name: 'Half-Yearly', price: '3,000', originalPrice: '3,500', duration: '6 Months', features: ['Full Gym Access', 'All Services', 'Diet Plan', 'Weight Control'] },
  { name: 'Yearly', price: '5,000', originalPrice: '8,999', duration: '12 Months', features: ['Full Gym Access', 'All Services', 'Advanced Diet', 'PT Consultation'], popular: true }
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
      signInAnonymously(auth);
      onAuthStateChanged(auth, setUser);
    } catch (e) { console.error(e); }
  }, []);

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
    <div className="relative min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-400/30 overflow-x-hidden">
      
      {/* Global Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-400/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="p-2 bg-yellow-400/10 rounded-xl group-hover:bg-yellow-400/20 transition-colors">
              <Dumbbell className="w-7 h-7 text-yellow-400" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">OXYGEN <span className="text-yellow-400">GYM</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors tracking-widest">SERVICES</a>
            <a href="#gallery" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors tracking-widest">GALLERY</a>
            <a href="#trainers" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors tracking-widest">TEAM</a>
            <a href="#pricing" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors tracking-widest">PRICING</a>
            
            <div className="relative">
              <button onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm">
                <MapPin className="w-4 h-4 text-yellow-400" /> {activeBranch.name.split(' - ')[1]}
                <ChevronDown className={`w-4 h-4 transition-transform text-zinc-400 ${isBranchMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBranchMenuOpen && (
                <div className="absolute top-full mt-3 right-0 w-64 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                  {branches.map(b => (
                    <button key={b.id} onClick={() => { setActiveBranch(b); setIsBranchMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${activeBranch.id === b.id ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-white/5 text-zinc-400'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#enquiry" className="bg-yellow-400 hover:bg-yellow-500 text-black px-7 py-2.5 rounded-full font-black tracking-wide text-xs shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all">JOIN NOW</a>
          </div>
          <button className="md:hidden p-2 rounded-full bg-white/5 border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950 p-6 flex flex-col pt-24 animate-in fade-in duration-300">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full"><X /></button>
          <div className="flex flex-col gap-6">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black">SERVICES</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black">GALLERY</a>
            <a href="#trainers" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black">TEAM</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black">PRICING</a>
          </div>
          <div className="mt-auto space-y-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
               <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Switch Branch</p>
               <div className="flex flex-col gap-2">
                 {branches.map(b => (
                   <button key={b.id} onClick={() => { setActiveBranch(b); setIsMobileMenuOpen(false); }} className={`p-3 rounded-xl text-left text-sm ${activeBranch.id === b.id ? 'bg-yellow-400 text-black font-bold' : 'bg-white/5'}`}>
                     {b.name}
                   </button>
                 ))}
               </div>
             </div>
             <a href="#enquiry" onClick={() => setIsMobileMenuOpen(false)} className="block bg-yellow-400 text-black p-5 text-center rounded-2xl font-black text-xl shadow-lg">JOIN NOW</a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={activeBranch.heroImage} className="w-full h-full object-cover opacity-40 transition-opacity duration-1000 grayscale-[0.3]" alt="Gym" key={activeBranch.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            Oxygen <span className="text-yellow-400">{activeBranch.name.split(' - ')[1]}</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] mb-8">
            REDEFINE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600">LIMITS.</span>
          </h1>
          <div className="max-w-2xl border-l-4 border-yellow-400 pl-6 py-2 mb-8 bg-white/5 backdrop-blur-sm rounded-r-2xl animate-in slide-in-from-left duration-700">
            <p className="text-xl md:text-3xl font-medium italic">"{currentQuote}"</p>
          </div>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-xl mb-12 leading-relaxed font-light">{activeBranch.description}</p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a href="#pricing" className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-5 rounded-full font-black tracking-wide text-lg flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:-translate-y-1 transition-all">
              VIEW MEMBERSHIPS <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </a>
            <a href="#services" className="bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center hover:bg-white/10 transition-all">Explore Services</a>
          </div>
        </div>
      </section>

      {/* AMENITIES & MAP */}
      <section id="features" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">THE FACILITY</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase tracking-tighter">Premium <br/><span className="text-zinc-500">EXPERIENCE</span></h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {activeBranch.amenities.map((a, i) => (
                <div key={i} className="bg-zinc-900/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-3 shadow-sm hover:border-yellow-400/40 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" /> {a.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-5 bg-zinc-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/20"><MapPin className="text-yellow-400" /></div>
                <div><h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Location</h3><p className="text-zinc-400 text-sm font-medium">{activeBranch.address}</p></div>
              </div>
              <div className="flex items-start gap-5 bg-zinc-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/20"><Clock className="text-yellow-400" /></div>
                <div><h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Operating Hours</h3><p className="text-zinc-400 text-sm font-medium">{activeBranch.hours}</p></div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-[3rem] bg-gradient-to-b from-white/10 to-white/0 shadow-2xl">
            <div className="w-full h-80 md:h-[500px] rounded-[2.5rem] overflow-hidden relative bg-zinc-900">
              <iframe title="map" src={activeBranch.mapUrl} width="100%" height="100%" className="grayscale contrast-125 invert-[0.9] opacity-80 hover:opacity-100 transition-opacity" style={{border:0}} key={activeBranch.id}></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-32 px-4 relative bg-zinc-900/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">TOUR THE GYM</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">Visual Gallery</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeBranch.gallery.map((img, i) => (
            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 group relative">
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery" />
              <div className="absolute inset-0 bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-8 h-8 text-black" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-32 px-4">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">OUR EXPERTISE</span>
          <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Services We Provide</h2>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeBranch.services.map((s, i) => (
            <div key={i} className="bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-zinc-900 transition-all duration-300 flex flex-col gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-yellow-400 transition-all"><Dumbbell className="w-7 h-7 text-zinc-500 group-hover:text-black" /></div>
              <h3 className="text-xl font-bold text-white tracking-tight">{s}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ELITE TRAINERS */}
      <section id="trainers" className="py-32 px-4 bg-zinc-900/20 relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">THE EXPERTS</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Meet Your Coaches</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {activeBranch.trainers.map((t, i) => (
            <div key={i} className="bg-zinc-950 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:border-yellow-400/30 transition-all">
              <img src={t.image} className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="Trainer" />
              <div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{t.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 relative">
              <Quote className="w-10 h-10 text-yellow-400/20 absolute top-8 right-8" />
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-zinc-300 text-lg font-light leading-relaxed mb-8 italic">"{t.text}"</p>
              <h4 className="text-white font-black uppercase text-sm tracking-widest">— {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">MEMBERSHIPS</span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white uppercase tracking-tighter leading-none">Choose Your Plan</h2>
          <p className="text-lg text-zinc-400 font-light max-w-3xl mx-auto italic">
            {activeBranch.id === 'lrbande' ? `The LR Bande branch is an exclusive luxury facility. Please contact us directly for customized elite pricing.` : `Discounted rates active at ${activeBranch.name.split(' - ')[1]}!`}
          </p>
        </div>
        {activeBranch.id === 'lrbande' ? (
          <div className="max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
            <Phone className="w-16 h-16 text-yellow-400 mx-auto mb-8 relative z-10" />
            <h3 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter relative z-10">Elite Pricing <br/> <span className="text-yellow-400 font-serif lowercase italic">available on request</span></h3>
            <p className="text-zinc-400 mb-12 text-lg font-light max-w-xl mx-auto relative z-10 leading-relaxed">Due to the premium nature of the LR Bande facility and its advanced premier machinery, we offer customized membership experiences. Speak with our team to find your perfect plan.</p>
            
            <div className="flex flex-col gap-4 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Direct Contact Lines</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <a href={`tel:${activeBranch.phone}`} className="bg-yellow-400 text-black p-5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all shadow-lg active:scale-95">
                  <Phone className="w-4 h-4" /> {activeBranch.phone.split(' / ')[0]}
                </a>
                {activeBranch.secondaryPhones?.map((num, idx) => (
                  <a key={idx} href={`tel:${num}`} className="bg-white/5 border border-white/10 text-white p-5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                    <Phone className="w-4 h-4" /> {num}
                  </a>
                ))}
              </div>
              <a href={`https://wa.me/${activeBranch.whatsapp}`} className="bg-green-500/10 border border-green-500/20 text-green-400 p-5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-2 mt-2 hover:bg-green-500/20 transition-all active:scale-95">
                <MessageCircle className="w-4 h-4" /> WHATSAPP LR BANDE
              </a>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {pricingPlans.map((p, i) => (
              <div key={i} className={`relative p-10 rounded-[3rem] flex flex-col ${p.popular ? 'bg-yellow-400 text-black md:-translate-y-4 shadow-2xl' : 'bg-zinc-900/50 border border-white/5'}`}>
                {p.popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">BEST VALUE</div>}
                <h3 className={`text-2xl font-black mb-8 ${p.popular ? 'text-black' : 'text-white'}`}>{p.name.toUpperCase()}</h3>
                <div className="mb-10">
                  <div className="text-6xl font-black tracking-tighter">₹{p.price}</div>
                  <div className={`text-sm font-bold opacity-60 mt-1`}>/{p.duration}</div>
                  <div className="text-xs font-bold line-through mt-2 opacity-40 italic">WAS ₹{p.originalPrice}</div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {p.features.map((f, fi) => <li key={fi} className="flex gap-4 text-sm font-black uppercase tracking-wide"><CheckCircle2 className={`w-5 h-5 shrink-0 ${p.popular ? 'text-black' : 'text-yellow-400'}`} /> {f}</li>)}
                </ul>
                <a href="#enquiry" className={`w-full py-5 rounded-full font-black text-center transition-all ${p.popular ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white/10 text-white hover:bg-white/20'}`}>SELECT PLAN</a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ENQUIRY */}
      <section id="enquiry" className="py-32 px-4 relative">
        <div className="max-w-5xl mx-auto bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Join Today</h2>
            <p className="text-zinc-400 mt-4 text-lg font-light italic">Oxygen {activeBranch.name.split(' - ')[1]} is ready for your transformation.</p>
          </div>
          <form onSubmit={handleEnquirySubmit} className="max-w-3xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950/50 border border-white/10 p-5 rounded-2xl w-full text-white focus:border-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-bold" />
              <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-zinc-950/50 border border-white/10 p-5 rounded-2xl w-full text-white focus:border-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-bold" />
            </div>
            <textarea placeholder="Tell us about your fitness goals..." value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="bg-zinc-950/50 border border-white/10 p-5 rounded-2xl w-full h-40 text-white focus:border-yellow-400 outline-none transition-all resize-none placeholder:text-zinc-700 font-bold"></textarea>
            {formStatus.success && <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-center font-bold">✓ Submission received! Talk soon.</div>}
            <button type="submit" disabled={formStatus.loading} className="w-full bg-yellow-400 text-black py-5 rounded-full font-black tracking-widest text-lg hover:scale-[0.99] transition-all shadow-2xl flex items-center justify-center gap-3 uppercase">
              {formStatus.loading ? <><Loader2 className="animate-spin" /> SENDING...</> : <><Send className="w-5 h-5" /> Submit Enquiry</>}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-white/5 py-32 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <Dumbbell className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-black tracking-tighter uppercase text-white">OXYGEN <span className="text-yellow-400">GYM</span></span>
            </div>
            <p className="text-zinc-500 max-w-sm font-medium leading-relaxed italic">"Redefining fitness with premium facilities across Bengaluru. Join the movement and reach your peak potential today."</p>
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8">Branches</h4>
            <ul className="space-y-4 text-zinc-500 text-xs font-black">
              {branches.map(b => <li key={b.id} onClick={() => { setActiveBranch(b); window.scrollTo({top:0, behavior:'smooth'}); }} className="cursor-pointer hover:text-yellow-400 transition-colors uppercase tracking-widest">{b.name.split(' - ')[1]}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8">Management Contacts</h4>
            <div className="space-y-4">
              <a href="tel:+916360367717" className="block text-white hover:text-yellow-400 transition-colors text-lg font-black tracking-tighter">63603 67717</a>
              <a href="tel:+918310885207" className="block text-white hover:text-yellow-400 transition-colors text-lg font-black tracking-tighter">83108 85207</a>
              <a href="tel:+918618038563" className="block text-white hover:text-yellow-400 transition-colors text-lg font-black tracking-tighter">86180 38563</a>
              
              <div className="pt-8 border-t border-white/5 space-y-2">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  © 2026 OXYGEN GYM BENGALURU. ALL RIGHTS RESERVED.
                </p>
                <div className="flex gap-4 text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
                  <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Use</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={`https://wa.me/${activeBranch.whatsapp}?text=Hi Oxygen Gym! I want to join the ${activeBranch.name.split(' - ')[1]} branch.`} target="_blank" rel="noreferrer" className="fixed bottom-10 right-10 bg-[#25D366] text-white p-5 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] z-50 hover:scale-110 hover:-translate-y-2 transition-all duration-300 group">
        <svg className="w-8 h-8 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>

    </div>
  );
}
