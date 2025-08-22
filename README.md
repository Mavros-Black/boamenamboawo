# Boa Me Youth Empowerment Website

A modern, responsive website for Boa Me Youth Empowerment NGO with e-commerce functionality and Paystack payment integration.

## 🌟 Features

### Core Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Multi-page Website**: Home, About, Programs, Shop, Donate, Contact pages
- **E-commerce Shop**: Product listings, cart functionality, and secure checkout
- **Payment Integration**: Paystack payment gateway for donations and shop purchases
- **Contact Forms**: Newsletter subscription and contact form with validation
- **SEO Optimized**: Meta tags, structured data, and performance optimized

### Pages
1. **Homepage**: Hero section, mission showcase, impact statistics, call-to-action
2. **About**: Organization story, mission/vision, team, values, milestones
3. **Programs**: Current and past projects with support options
4. **Shop**: E-commerce with product categories, search, and cart
5. **Donate**: Secure donation form with Paystack integration
6. **Contact**: Contact form, FAQ, and organization details

### Technical Features
- **Next.js 14**: App Router with TypeScript
- **Tailwind CSS**: Utility-first styling
- **Paystack Integration**: Payment processing for Ghana
- **Responsive Navigation**: Mobile-friendly navigation with hamburger menu
- **Form Validation**: Client-side validation for all forms
- **Loading States**: Smooth loading animations and feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Paystack account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Paystack Configuration
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   
   # Application Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Paystack Setup
1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from the dashboard
3. Add the keys to your environment variables
4. Configure webhook endpoints (optional)

### Customization
- **Colors**: Update the green color scheme in `tailwind.config.js`
- **Content**: Modify text content in the page components
- **Products**: Update product data in `/src/app/shop/page.tsx`
- **Programs**: Update program data in `/src/app/programs/page.tsx`

## 📁 Project Structure

```
baome/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── paystack/      # Paystack API endpoints
│   │   ├── about/             # About page
│   │   ├── programs/          # Programs page
│   │   ├── shop/              # Shop page
│   │   ├── donate/            # Donate page
│   │   ├── contact/           # Contact page
│   │   ├── payment/           # Payment callback
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── Footer.tsx         # Footer component
│   │   ├── ProductCard.tsx    # Product display component
│   │   └── CartSidebar.tsx    # Shopping cart component
│   └── lib/                   # Utility libraries
│       └── paystack.ts        # Paystack integration
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Customization Guide

### Updating Content
1. **Organization Information**: Update contact details in `Footer.tsx` and `ContactPage`
2. **Mission & Vision**: Modify content in `AboutPage` and homepage
3. **Programs**: Update program data in `ProgramsPage`
4. **Products**: Modify product listings in `ShopPage`

### Styling
- **Colors**: Update the green theme in `tailwind.config.js`
- **Fonts**: Change fonts in `layout.tsx`
- **Layout**: Modify component layouts and spacing

### Adding Features
- **New Pages**: Create new directories in `src/app/`
- **Components**: Add reusable components in `src/components/`
- **API Routes**: Create new API endpoints in `src/app/api/`

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (recommended)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **Railway**: Connect repository and add environment variables
- **DigitalOcean App Platform**: Deploy with Node.js configuration

### Environment Variables for Production
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 🔒 Security

### Payment Security
- All payments processed through Paystack's secure infrastructure
- No sensitive payment data stored on the server
- SSL/TLS encryption for all transactions

### Data Protection
- Form validation on both client and server side
- Environment variables for sensitive configuration
- Input sanitization for user-generated content

## 📱 Mobile Responsiveness

The website is fully responsive and optimized for:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1280px+)

## 🌍 Internationalization

Currently supports:
- **English** (primary language)
- **Ghanaian context** (currency, location, payment methods)

Future enhancements:
- **Local languages** (Twi, Ga, Ewe)
- **Multi-currency support**
- **Regional payment methods**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: info@boamenameboawo.com
- **Phone**: +233 XX XXX XXXX
- **Address**: Accra, Ghana

## 🙏 Acknowledgments

- **Paystack** for payment processing
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons
- **Boa Me Youth Empowerment** team for the vision and mission

---

**Built with ❤️ for youth empowerment in Ghana**
