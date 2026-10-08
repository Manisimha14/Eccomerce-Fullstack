import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  UserRound,
  LogIn,
  UserPlus,
  Heart,
  Sparkles,
  Zap,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../context/useCart.js";

const quickLinks = [
  {
    title: "Products",
    description: "Explore everything available in the store.",
    href: "/products",
    icon: ShoppingBag,
    number: "01",
  },
  {
    title: "Login",
    description: "Access your account and continue.",
    href: "/login",
    icon: LogIn,
    number: "02",
  },
  {
    title: "Register",
    description: "Create your account in seconds.",
    href: "/register",
    icon: UserPlus,
    number: "03",
  },
  {
    title: "Profile",
    description: "Manage your account and details.",
    href: "/profile",
    icon: UserRound,
    number: "04",
  },
  {
    title: "Wishlist",
    description: "View your saved products.",
    href: "/wishlist",
    icon: Heart,
    number: "05",
  },
  {
    title: "Cart",
    description: "Review items you have added to your cart.",
    href: "/cart",
    icon: ShoppingCart,
    number: "06",
  },
];

const features = [
  {
    icon: Zap,
    title: "FAST",
    description: "A simple and responsive experience built for speed.",
  },
  {
    icon: ShieldCheck,
    title: "SECURE",
    description: "Authentication and protected functionality built in.",
  },
  {
    icon: Sparkles,
    title: "MODERN",
    description: "Clean interfaces with smooth modern interactions.",
  },
];

function Home() {
  const { itemCount } = useCart();

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >
        <Link to="/">
          <motion.div
            whileHover={{
              x: 3,
              y: -3,
            }}
            className="border-4 border-white bg-blue-500 px-4 py-2 font-black tracking-tighter shadow-[6px_6px_0px_#ffffff]"
          >
            LAB<span className="text-black">PROJECT</span>
          </motion.div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/products">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black"
            >
              Products
            </Button>
          </Link>

          <Link to="/wishlist">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black"
            >
              Wishlist
            </Button>
          </Link>

          <Link to="/cart">
            <Button
              variant="ghost"
              className="relative font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black"
            >
              Cart
              <span className="ml-2 inline-flex min-w-6 items-center justify-center border border-blue-500 px-1.5 py-0.5 text-[10px] font-black text-blue-500">
                {itemCount}
              </span>
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black"
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button className="border-2 border-white bg-blue-500 font-black uppercase text-white shadow-[4px_4px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-blue-600 hover:shadow-none">
              Get Started
            </Button>
          </Link>
        </div>
      </motion.nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <Badge className="mb-7 rounded-none border-2 border-white bg-white px-4 py-2 font-black uppercase tracking-widest text-black">
              <Sparkles className="mr-2 h-4 w-4" />
              Welcome to LabProject
            </Badge>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl md:text-8xl lg:text-9xl">
              BUILD.
              <br />
              <span className="text-blue-500">CONNECT.</span>
              <br />
              MANAGE.
            </h1>

            <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-zinc-400 sm:text-xl">
              A simple, powerful platform to explore products, manage your
              account, and connect everything in one place.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/products">
                <Button
                  size="lg"
                  className="h-14 w-full rounded-none border-4 border-white bg-blue-500 px-7 text-base font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_#ffffff] transition-all hover:translate-x-0.75 hover:translate-y-0.75 hover:bg-blue-600 hover:shadow-none sm:w-auto"
                >
                  Explore Products
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full rounded-none border-4 border-white bg-transparent px-7 text-base font-black uppercase tracking-wide text-white hover:bg-white hover:text-black sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            <Card className="rounded-none border-4 border-white bg-[#151515] text-white shadow-[10px_10px_0px_#3b82f6]">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b-4 border-white p-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                      Quick Access
                    </p>

                    <h2 className="mt-1 text-2xl font-black uppercase text-white">
                      Everything You Need
                    </h2>
                  </div>

                  <div className="border-2 border-white p-2">
                    <ArrowUpRight className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div>
                  {quickLinks.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <Link key={item.title} to={item.href}>
                        <motion.div
                          initial={{
                            opacity: 0,
                            x: 20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: 0.4 + index * 0.1,
                          }}
                          whileHover={{
                            x: 6,
                          }}
                          className="group flex items-center gap-5 border-b-2 border-zinc-800 p-5 transition-colors hover:bg-blue-500"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-white bg-black text-white group-hover:bg-white group-hover:text-black">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-black uppercase text-white group-hover:text-black">
                                {item.title}
                              </h3>

                              <span className="font-mono text-xs text-zinc-500 group-hover:text-black">
                                {item.number}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-zinc-400 group-hover:text-black">
                              {item.description}
                            </p>
                          </div>

                          <ArrowUpRight className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:text-black group-hover:opacity-100" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                <div className="p-5">
                  <div className="border-2 border-dashed border-zinc-700 p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Ready when you are.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Separator className="h-1 bg-white" />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-blue-500">
            Why LabProject?
          </p>

          <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Simple. Fast. Powerful.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <Card className="h-full rounded-none border-4 border-white bg-[#151515] text-white shadow-[6px_6px_0px_#3b82f6]">
                  <CardContent className="p-7">
                    <div className="mb-7 flex h-14 w-14 items-center justify-center border-4 border-white bg-blue-500 text-white">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-2xl font-black">
                      {feature.title}
                    </h3>

                    <p className="mt-3 leading-relaxed text-zinc-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden border-4 border-white bg-blue-500 p-8 text-black shadow-[10px_10px_0px_#ffffff] sm:p-12 lg:p-16"
        >
          <div className="relative z-10 max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.3em]">
              Your next step
            </p>

            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
              LET'S BUILD
              <br />
              SOMETHING.
            </h2>

            <p className="mt-6 max-w-xl text-lg font-bold">
              Explore the platform and discover what you can do.
            </p>

            <Link to="/products">
              <Button
                size="lg"
                className="mt-8 h-14 rounded-none border-4 border-black bg-white px-7 font-black uppercase text-black shadow-[6px_6px_0px_#000000] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-none"
              >
                Start Exploring
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <motion.div
            animate={{
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -right-20 -top-20 h-64 w-64 border-30 border-black/10"
          />
        </motion.div>
      </section>

      <footer className="border-t-4 border-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-black uppercase tracking-tight">
              LABPROJECT
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Build. Connect. Manage.
            </p>
          </div>

          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-zinc-500">
            <Link
              to="/products"
              className="transition-colors hover:text-blue-500"
            >
              Products
            </Link>

            <Link
              to="/wishlist"
              className="transition-colors hover:text-blue-500"
            >
              Wishlist
            </Link>

            <Link
              to="/profile"
              className="transition-colors hover:text-blue-500"
            >
              Profile
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;