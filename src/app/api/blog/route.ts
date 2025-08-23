import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Check if Supabase is configured
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// GET - Fetch all blog posts
export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - returning empty blog posts')
      return NextResponse.json({ blogPosts: [] })
    }

    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ blogPosts })
  } catch (error) {
    console.error('Error in GET /api/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image_url, author_id, status } = body

    

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    const newBlogPost = {
      title,
      content,
      excerpt: excerpt || '',
      image_url: image_url || '',
      author_id: null, // Set to null to avoid foreign key constraint issues
      status: status || 'draft',
      published_at: status === 'published' ? new Date().toISOString() : null
    }

    

    const { data: blogPost, error } = await supabase
      .from('blog_posts')
      .insert([newBlogPost])
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: `Failed to create blog post: ${error.message}` },
        { status: 500 }
      )
    }

    
    return NextResponse.json({ blogPost }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, excerpt, image_url, status } = body

    

    // Validate required fields
    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'ID, title and content are required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    const updatedBlogPost = {
      title,
      content,
      excerpt: excerpt || '',
      image_url: image_url || '',
      status: status || 'draft',
      published_at: status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }

    

    const { data: blogPost, error } = await supabase
      .from('blog_posts')
      .update(updatedBlogPost)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json(
        { error: `Failed to update blog post: ${error.message}` },
        { status: 500 }
      )
    }

    
    return NextResponse.json({ blogPost })
  } catch (error) {
    console.error('Error in PUT /api/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: `Failed to delete blog post: ${error.message}` },
        { status: 500 }
      )
    }

    
    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

