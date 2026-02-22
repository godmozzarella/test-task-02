"use client"

import React, { ChangeEvent, useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"

interface FormData {
  name: string
  shortDescription: string
  longDescription: string
  article: string
  price: string
  category: string
}

interface ProductFormProps {
  onSuccess: () => void
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "",
    shortDescription: "",
    longDescription: "",
    article: "",
    price: "",
    category: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault()
    }
  }

  const generateArticle = (): string => {
    return "ART" + Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void | Promise<void> = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const article = form.article.trim() === "" ? generateArticle() : form.article.trim()

      const payload = [{
        name: form.name,
        code: article,
        description_short: form.shortDescription,
        description_long: form.longDescription,
        marketplace_price: Number(form.price) || 0,
        category: form.category ? Number(form.category) : 1,
        unit: 116,
        cashback_type: "lcard_cashback",
        seo_title: form.name || "SEO Title",
        seo_description: form.shortDescription || "SEO Description",
        seo_keywords: [],
        address: "",
        latitude: 0,
        longitude: 0,
        type: "product",
      }]

      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error("Failed to create product: " + errorText)
      }

      await response.json()
      onSuccess()

      setForm({
        name: "",
        shortDescription: "",
        longDescription: "",
        article: "",
        price: "",
        category: "",
      })
      alert("Товар успешно создан")
    } catch (error) {
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" >
      <div>
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="shortDescription">Краткое описание</Label>
        <Input id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="longDescription">Длинное описание</Label>
        <Textarea id="longDescription" name="longDescription" value={form.longDescription} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="article">Артикул</Label>
        <Input id="article" name="article" value={form.article} onChange={handleChange} placeholder="Оставьте пустым для генерации" />
      </div>

      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Категория</Label>
        <Input id="category" name="category" type="number"
          min="1" value={form.category} onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          placeholder="Введите ID категории"
          required />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Создание..." : "Создать товар"}
      </Button>
    </form>
  )
}