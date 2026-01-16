"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, Search, Briefcase, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 transition-transform duration-500 ease-out group-hover:rotate-12">
               <Image
                src="/logo.png"
                alt="i'llTip Logo"
                fill
                className="object-contain"
               />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">i'llTip</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
                <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
            </div>
            <div className="h-6 w-px bg-border hidden md:block" />
            <ModeToggle />
            <div className="hidden sm:flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="rounded-full px-8 font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-[110vh] items-center justify-center pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_80%)]" />
        </div>

        <motion.div 
            style={{ opacity, scale }}
            className="container mx-auto px-6"
        >
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Text Content */}
            <div className="flex flex-col gap-8 text-center lg:text-left z-10">
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
              >
                  <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-md mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    The #1 Job Matching Platform
                  </div>
                  <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-[1.1]">
                    Unlock Your <br />
                    <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">Potential</span>
                  </h1>
              </motion.div>
              
              <motion.p 
                className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Stop searching, start working. We use AI to match your unique skills 
                and major with verified employers looking for talent like you.
              </motion.p>
              
              <motion.div 
                className="flex flex-col gap-5 sm:flex-row sm:justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <Link href="/login">
                  <Button size="lg" className="h-14 w-full rounded-full px-10 text-lg font-bold shadow-2xl shadow-primary/30 sm:w-auto hover:scale-105 transition-transform">
                    Find Your Job <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                   <Button variant="outline" size="lg" className="h-14 w-full rounded-full px-10 text-lg font-medium border-2 hover:bg-muted/50 sm:w-auto hover:border-primary/50 transition-colors">
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6, duration: 1 }}
                 className="flex items-center justify-center lg:justify-start gap-8 pt-4 grayscale opacity-70"
              >
                  {/* Mock Partner Logos */}
                  {['Google', 'Microsoft', 'Spotify', 'Amazon'].map((brand) => (
                      <span key={brand} className="text-xl font-bold text-muted-foreground/50">{brand}</span>
                  ))}
              </motion.div>
            </div>

            {/* Hero Image / 3D Composition */}
            <div className="relative perspective-1000">
                <motion.div 
                    initial={{ opacity: 0, rotateY: -20, x: 100 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    className="relative z-10"
                >
                     <div className="relative h-[500px] w-full lg:h-[700px]">
                         <Image
                            src="/splash.png"
                            alt="Dashboard Preview"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                     </div>

                     {/* Floating Cards */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="absolute top-20 -left-10 bg-background/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 hidden lg:block"
                     >
                         <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                 <CheckCircle className="h-6 w-6" />
                             </div>
                             <div>
                                 <p className="text-sm font-semibold">Job Match Found</p>
                                 <p className="text-xs text-muted-foreground">98% Compatibility</p>
                             </div>
                         </div>
                     </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="absolute bottom-40 -right-5 bg-background/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 hidden lg:block"
                     >
                         <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                 <Briefcase className="h-6 w-6" />
                             </div>
                             <div>
                                 <p className="text-sm font-semibold">New Interview</p>
                                 <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                             </div>
                         </div>
                     </motion.div>
                </motion.div>

                 {/* Decorative Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  {[
                      { label: "Active Jobs", value: "10k+", icon: Search },
                      { label: "Companies", value: "500+", icon: Briefcase },
                      { label: "Job Seekers", value: "1M+", icon: Users },
                      { label: "Success Rate", value: "95%", icon: TrendingUp },
                  ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                          <stat.icon className="h-6 w-6 text-primary mb-2" />
                          <h3 className="text-4xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">{stat.value}</h3>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-background relative">
           <div className="container mx-auto px-6">
               <div className="text-center mb-24">
                   <h2 className="text-4xl font-bold tracking-tight mb-4">How <span className="text-primary">i'llTip</span> Works</h2>
                   <p className="text-xl text-muted-foreground">Your journey to your dream job in 3 simple steps</p>
               </div>
               
               <div className="grid md:grid-cols-3 gap-12 relative">
                   {/* Connecting Line (Mobile Hidden) */}
                   <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent hidden md:block" />

                   {[
                       { title: "Create Profile", desc: "Sign up and build your comprehensive professional profile.", step: "01" },
                       { title: "Get Matched", desc: "Our AI matches you with jobs based on your major and skills.", step: "02" },
                       { title: "Get Hired", desc: "Connect with employers, interview, and land the job.", step: "03" },
                   ].map((item, i) => (
                       <motion.div 
                           key={i}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.2 }}
                           className="relative flex flex-col items-center text-center group"
                       >
                           <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-border group-hover:border-primary group-hover:bg-primary/5 transition-all flex items-center justify-center text-3xl font-bold text-muted-foreground group-hover:text-primary z-10 mb-6 shadow-lg">
                               {item.step}
                           </div>
                           <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                           <p className="text-muted-foreground leading-relaxed px-4">{item.desc}</p>
                       </motion.div>
                   ))}
               </div>
           </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-muted/20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Why Industry Leaders Choose Us</h2>
                    <p className="text-xl text-muted-foreground">We provide the tools you need to accelerate your career growth.</p>
                </div>
                <Button variant="outline" className="rounded-full">View All Features</Button>
           </div>

           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Smart AI Matching", desc: "Forget scrolling. Our algorithm finds the perfect cultural and skill fit for you.", color: "bg-purple-500/10 text-purple-600" },
                { title: "Verified Badges", desc: "Stand out with verified skills and education badges that employers trust.", color: "bg-blue-500/10 text-blue-600" },
                { title: "Career Analytics", desc: "Track your profile performance and see who's viewing your application.", color: "bg-green-500/10 text-green-600" },
                { title: "Direct Messaging", desc: "Chat directly with hiring managers once you match.", color: "bg-orange-500/10 text-orange-600" },
                { title: "Salary Insights", desc: "Know your worth with real-time market salary data.", color: "bg-red-500/10 text-red-600" },
                { title: "Learning Hub", desc: "Access curated courses to bridge your skill gaps.", color: "bg-pink-500/10 text-pink-600" },
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  className="group relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-sm p-8 transition-all hover:bg-background hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}>
                      <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
              <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
                  {/* Abstract shapes */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <svg width="100%" height="100%">
                          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                             <circle cx="20" cy="20" r="2" fill="currentColor" />
                          </pattern>
                          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                      </svg>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-3xl mx-auto space-y-8"
                  >
                      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to Shape Your Future?</h2>
                      <p className="text-xl md:text-2xl text-primary-foreground/80">Join thousands of professionals finding their dream jobs with i'llTip today.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                           <Link href="/login">
                              <Button size="lg" variant="secondary" className="h-16 rounded-full px-12 text-xl font-bold text-primary hover:scale-105 transition-transform shadow-xl">
                                Get Started Now
                              </Button>
                           </Link>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
      
      {/* Footer */}
       <footer className="border-t bg-background pt-24 pb-12">
          <div className="container mx-auto px-6">
             <div className="grid md:grid-cols-4 gap-12 mb-16">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} />
                        <span className="text-xl font-bold">i'llTip</span>
                    </div>
                    <p className="text-muted-foreground">Empowering the workforce with AI-driven job matching and career development tools.</p>
                 </div>
                 
                 {[
                     { header: "Platform", links: ["Browse Jobs", "Companies", "Pricing", "Features"] },
                     { header: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
                     { header: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
                 ].map((col, i) => (
                     <div key={i}>
                         <h4 className="font-bold mb-6">{col.header}</h4>
                         <ul className="space-y-4 text-muted-foreground">
                             {col.links.map(link => (
                                 <li key={link}>
                                     <Link href="#" className="hover:text-primary transition-colors">{link}</Link>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 ))}
             </div>
             
             <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} i'llTip. All rights reserved.</p>
             </div>
          </div>
       </footer>
    </div>
  );
}
