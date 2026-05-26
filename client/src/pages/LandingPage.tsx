import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Award, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import Layout from '../components/layout/Layout';

const LandingPage: React.FC = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">Showcase Your Innovation</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400">
                            Student Project Showcase Platform
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            A modern platform where students showcase their amazing projects and receive valuable feedback from instructors.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg" className="shadow-glow">
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/projects">
                                <Button size="lg" variant="outline">
                                    Browse Projects
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to showcase and manage student projects in one place
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Rocket className="h-10 w-10" />,
                                title: 'Public Showcase',
                                description: 'All projects are publicly visible, allowing anyone to browse and discover amazing student work.',
                                gradient: 'from-purple-500 to-pink-500',
                            },
                            {
                                icon: <Award className="h-10 w-10" />,
                                title: 'Expert Feedback',
                                description: 'Instructors can provide valuable feedback on assigned projects to help students improve.',
                                gradient: 'from-pink-500 to-red-500',
                            },
                            {
                                icon: <Users className="h-10 w-10" />,
                                title: 'Role-Based Access',
                                description: 'Secure authentication with separate dashboards for students and instructors.',
                                gradient: 'from-red-500 to-orange-500',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="p-6 rounded-xl border bg-card hover:shadow-glow-sm transition-all duration-300"
                            >
                                <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg w-fit mb-4`}>
                                    <div className="text-white">{feature.icon}</div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Showcase Your Work?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Join our community of talented students and experienced instructors today.
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="shadow-glow">
                                Create Free Account
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default LandingPage;
