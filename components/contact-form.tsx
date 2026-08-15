"use client";

import { useState, type FormEvent } from "react";

type ContactFormProps = {
  recipient: string;
  labels: {
    name: string;
    namePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    pending: string;
  };
};

export function ContactForm({ recipient, labels }: ContactFormProps) {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = `Pesan kontak dari ${name}`;
    const body = [`Nama: ${name}`, `Email: ${email}`, "", message].join("\n");
    setStatus("Membuka aplikasi email…");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <form className="contact-form" onSubmit={submit}><label htmlFor="name">{labels.name}<span>*</span></label><input id="name" name="name" autoComplete="name" placeholder={labels.namePlaceholder} required /><label htmlFor="email">Email<span>*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com…" required /><label htmlFor="message">{labels.message}<span>*</span></label><textarea id="message" name="message" rows={6} placeholder={labels.messagePlaceholder} required /><button className="button button-light" type="submit">{labels.send} <span aria-hidden="true">↗</span></button><p className="placeholder-note" aria-live="polite">{status || labels.pending}</p></form>;
}
