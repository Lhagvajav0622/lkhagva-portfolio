import CustomCursor from '../components/CustomCursor'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import PortfolioSection from '../components/portfolio/PortfolioSection'
import About from '../components/About'
import Process from '../components/Process'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function MainSite() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Services />
      <PortfolioSection />
      <About />
      <Process />
      <Pricing />
      <Contact />
      <Footer />
    </>
  )
}
