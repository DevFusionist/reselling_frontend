// app/contact/page.tsx


"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export default function ContactPage() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
console.log({name, email, message});
};


return (
<div className="max-w-5xl mx-auto p-6 sm:p-12">
<motion.h1
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="text-4xl font-semibold mb-10 text-center"
>
Contact Us
</motion.h1>


<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
<motion.div
initial={{ opacity: 0, x: -40 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.7 }}
className="space-y-6"
>
<h2 className="text-2xl font-semibold">Get in Touch</h2>
<p className="text-muted-foreground">
Have questions, feedback, or need help? Fill out the form and our team
will get back to you shortly.
</p>
<p className="text-muted-foreground font-medium">📍 Location: India</p>
<p className="text-muted-foreground font-medium">📧 Email: support@horekmal.com</p>
<p className="text-muted-foreground font-medium">📞 Phone: +91 9876543210</p>
</motion.div>


<motion.form
initial={{ opacity: 0, x: 40 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.7 }}
className="space-y-6 bg-white/60 dark:bg-black/30 p-8 rounded-xl backdrop-blur-md shadow-md"
>
<div>
<label className="text-sm font-medium">Name</label>
<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="mt-2" />
</div>


<div>
<label className="text-sm font-medium">Email</label>
<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="mt-2" />
</div>


<div>
<label className="text-sm font-medium">Message</label>
<Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." className="mt-2" />
</div>


<Button className="w-full py-6 text-lg rounded-full" onClick={handleSubmit}>Send Message</Button>
</motion.form>
</div>
</div>
);
}