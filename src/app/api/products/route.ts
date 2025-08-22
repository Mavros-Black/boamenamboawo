import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all products
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image_url, category, in_stock, stock_quantity } = body

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const newProduct = {
      name,
      description: description || '',
      price: parseFloat(price),
      image_url: image_url || '',
      category: category || 'General',
      in_stock: in_stock !== undefined ? in_stock : true,
      stock_quantity: stock_quantity || 0
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, image_url, category, in_stock, stock_quantity } = body

    // Validate required fields
    if (!id || !name || !price) {
      return NextResponse.json(
        { error: 'ID, name and price are required' },
        { status: 400 }
      )
    }

    const updatedProduct = {
      name,
      description: description || '',
      price: parseFloat(price),
      image_url: image_url || '',
      category: category || 'General',
      in_stock: in_stock !== undefined ? in_stock : true,
      stock_quantity: stock_quantity || 0,
      updated_at: new Date().toISOString()
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in PUT /api/products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
