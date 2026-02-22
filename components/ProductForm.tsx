"use client"

import React, { ChangeEvent, useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import SeoKeywordsInput from "./SeoKeywordsInput"

interface FormData {
  name: string
  shortDescription: string
  longDescription: string
  code: string
  price: string
  category: string
  seoKeywords: string[]
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
    code: "",
    price: "",
    category: "",
    seoKeywords: [],
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
      const code = form.code.trim() === "" ? generateArticle() : form.code.trim()

      const payload = [{
        name: form.name,
        code: code,
        description_short: form.shortDescription,
        description_long: form.longDescription,
        marketplace_price: Number(form.price) || 0,
        category: form.category ? Number(form.category) : 1,
        unit: 116,
        cashback_type: "lcard_cashback",
        seo_title: form.name || "SEO Title",
        seo_description: form.shortDescription || "SEO Description",
        seo_keywords: form.seoKeywords,
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
        code: "",
        price: "",
        category: "",
        seoKeywords: [],
      })
      alert("Товар успешно создан")
    } catch (error) {
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const generateDescriptions = async (name: string) => {
    const response = await fetch("/api/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Ошибка API генерации:", text);
      throw new Error("Ошибка генерации описаний: " + text);
    }

    return await response.json();
  };

  const handleGenerateDescriptions = async () => {
    setLoading(true)
    try {
      console.log("Начало генерации...");
      const descriptions = await generateDescriptions(form.name.trim())
      console.log("Описания получены:", descriptions);
      setForm((prev) => ({
        ...prev,
        shortDescription: descriptions.shortDescription,
        longDescription: descriptions.longDescription,
      }))
    } catch (error) {
      alert("Ошибка при генерации описаний: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[full]" >
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

      <Button
        type="button"
        onClick={handleGenerateDescriptions}
        disabled={loading || !form.name.trim()}
        className="mt-2"
      >
        {loading ? "Генерация..." : !form.name.trim() ? "Введите название для генераци" : "Сгенерировать описания"}
      </Button>

      <div>
        <Label htmlFor="code">Артикул</Label>
        <Input id="code" name="code" value={form.code} onChange={handleChange} placeholder="Оставьте пустым для генерации" />
      </div>

      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.1"
          value={form.price}
          onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          placeholder="Введите цену в рублях"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Категория</Label>
        <Input id="category" name="category" type="number"
          min="1" value={form.category} onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          placeholder="Введите ID категории"
          className="appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
          required />
      </div>

      <div>
        <Label htmlFor="seoKeywords">Ключевые слова</Label>
        <SeoKeywordsInput value={form.seoKeywords} onChange={(keywords) => setForm({ ...form, seoKeywords: keywords })} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Создание..." : "Создать товар"}
      </Button>
    </form>
  )
}