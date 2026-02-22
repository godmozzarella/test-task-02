"use client"

import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    article: "",
    price: "",
    description: "",
  })

  //TODO: изменение формы
  const handleChange = () => {
    
  }

  //TODO: добавление товара
  const handleSubmit = async () => {
  
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Создание карточки товара</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div>
              <Label>Артикул</Label>
              <Input name="article" value={form.article} onChange={handleChange} />
            </div>

            <div>
              <Label>Цена</Label>
              <Input name="price" value={form.price} onChange={handleChange} />
            </div>

            <div>
              <Label>Описание</Label>
              <Input name="description" value={form.description} onChange={handleChange} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Создание..." : "Создать товар"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}