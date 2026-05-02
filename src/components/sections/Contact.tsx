"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Github, Mail, Twitter, Linkedin, ArrowRight } from "lucide-react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { personalData } from "@/lib/data"

const socials = [
  { label: "GITHUB", href: personalData.github, icon: Github },
  { label: "TWITTER", href: personalData.twitter, icon: Twitter },
  { label: "MAIL", href: `mailto:${personalData.email}`, icon: Mail },
  { label: "LINKEDIN", href: "https://linkedin.com/in/muyuzhong", icon: Linkedin },
]

const contactSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(50, "姓名过长"),
  email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().min(10, "留言内容至少10个字符").max(1000, "内容过长"),
})

type ContactForm = z.infer<typeof contactSchema>

export function Contact() {
  const sectionRef = useScrollAnimation({ selector: ".contact-content" })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactForm) => {
    const subject = encodeURIComponent(`来自个人网站的留言 - ${data.name}`)
    const body = encodeURIComponent(
      [
        `姓名：${data.name}`,
        `邮箱：${data.email}`,
        "",
        data.message,
      ].join("\n")
    )

    window.location.href = `mailto:${personalData.email}?subject=${subject}&body=${body}`
    toast.success("已打开邮件客户端", {
      description: "请在邮件客户端中确认并发送这封邮件。",
    })
    reset()
  }

  return (
    <section id="contact" ref={sectionRef} className="py-32 lg:py-40 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="contact-content">
          <SectionLabel number="05" title="CONTACT" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="contact-content">
            <h2 className="font-sans font-bold text-display-l text-foreground tracking-tight mb-6">
              一起创造
              <br />
              点什么。
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              如果您有任何项目合作、技术交流或工作机会，欢迎随时联系我。我很乐意与您探讨任何有趣的想法。
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                  data-cursor-hover
                >
                  <s.icon className="w-4 h-4" />
                  <BracketLabel>{s.label}</BracketLabel>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="contact-content space-y-8" noValidate>
            <div>
              <label className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground block mb-3">
                [NAME]
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 ${
                  errors.name ? "border-red-500" : "border-[hsla(0,0%,89%,0.12)]"
                }`}
                placeholder="您的姓名"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground block mb-3">
                [EMAIL]
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 ${
                  errors.email ? "border-red-500" : "border-[hsla(0,0%,89%,0.12)]"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground block mb-3">
                [MESSAGE]
              </label>
              <textarea
                rows={4}
                {...register("message")}
                className={`w-full bg-transparent border-b py-3 text-foreground focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-muted-foreground/50 ${
                  errors.message ? "border-red-500" : "border-[hsla(0,0%,89%,0.12)]"
                }`}
                placeholder="想对我说点什么..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-2">{errors.message.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.1em] text-foreground hover:text-accent transition-colors"
              data-cursor-hover
            >
              <BracketLabel hover={false} className="group-hover:text-accent transition-colors">
                OPEN MAIL
              </BracketLabel>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
