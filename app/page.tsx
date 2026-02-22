"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import ProductForm from "../components/ProductForm"

interface Product {
  name: string
  article: string
  price: number
  category: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      alert((error as Error).message)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen bg-muted/40 space-y-8 py-8">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Создание карточки товара</CardTitle>
        </CardHeader>

        <CardContent>
          <ProductForm onSuccess={fetchProducts} />
        </CardContent>
      </Card>
    </div>
  )
}
