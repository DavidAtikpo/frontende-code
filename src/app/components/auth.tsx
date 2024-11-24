'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Image from 'next/image'

export default function AuthPage() {
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="font-medium">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="font-medium">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Adresse mail</Label>
                <Input id="login-email" type="email" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Mot de passe oublié
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showLoginPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    </span>
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]" type="submit">
                CONNEXION
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button">
                <Image src="/placeholder.svg?height=16&width=16" alt="Google" className="mr-2 h-4 w-4" />
                Connexion avec Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <Image src="/placeholder.svg?height=16&width=16" alt="Apple" className="mr-2 h-4 w-4" />
                Connexion avec Apple
              </Button>
            </CardContent>
          </TabsContent>
          <TabsContent value="register">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nom</Label>
                <Input id="register-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Adresse mail</Label>
                <Input id="register-email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">8+ characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label htmlFor="terms" className="text-sm leading-none">
                  Vous acceptez ainsi les{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Condition
                  </Link>
                  {' '}et les{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <Button className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]" type="submit">
                CREER UN COMPTE
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button">
                <Image src="/placeholder.svg?height=16&width=16" alt="Google" className="mr-2 h-4 w-4" />
                Utiliser votre compte Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <Image src="/placeholder.svg?height=16&width=16" alt="Apple" className="mr-2 h-4 w-4" />
                Sign up with Apple
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}