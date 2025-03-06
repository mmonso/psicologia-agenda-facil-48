
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e preferências
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais e profissionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" placeholder="Seu nome completo" defaultValue="Dr. Paulo Souza" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" defaultValue="paulo.souza@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" defaultValue="(11) 98765-4321" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input id="specialty" placeholder="Sua especialidade" defaultValue="Psicologia Clínica" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia profissional</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Descreva brevemente sua formação e experiência profissional" 
                    className="min-h-32"
                    defaultValue="Psicólogo clínico com mais de 10 anos de experiência em terapia cognitivo-comportamental. Especialista em tratamento de ansiedade e depressão."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button className="button-bounce">Salvar alterações</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações do Consultório</CardTitle>
                <CardDescription>
                  Configure os dados do seu local de atendimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-name">Nome do consultório</Label>
                    <Input id="clinic-name" placeholder="Nome do consultório" defaultValue="Espaço Mente Saudável" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic-phone">Telefone do consultório</Label>
                    <Input id="clinic-phone" placeholder="(00) 0000-0000" defaultValue="(11) 3456-7890" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço completo</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Endereço do consultório" 
                    defaultValue="Av. Paulista, 1000, Sala 123, Bela Vista, São Paulo - SP, 01310-100"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button className="button-bounce">Salvar alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Consultas e Agendamento</CardTitle>
                <CardDescription>
                  Configure suas preferências de agendamento e valores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Duração padrão da sessão</Label>
                    <Input id="session-duration" type="number" placeholder="Duração em minutos" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-price">Valor da sessão (R$)</Label>
                    <Input id="session-price" type="number" placeholder="Valor em reais" defaultValue="150" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Horários de disponibilidade</Label>
                  <div className="rounded-md border p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Segunda-feira</div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24" defaultValue="09:00" />
                          <span>às</span>
                          <Input className="w-24" defaultValue="18:00" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Terça-feira</div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24" defaultValue="09:00" />
                          <span>às</span>
                          <Input className="w-24" defaultValue="18:00" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Quarta-feira</div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24" defaultValue="09:00" />
                          <span>às</span>
                          <Input className="w-24" defaultValue="18:00" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Quinta-feira</div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24" defaultValue="09:00" />
                          <span>às</span>
                          <Input className="w-24" defaultValue="18:00" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Sexta-feira</div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24" defaultValue="09:00" />
                          <span>às</span>
                          <Input className="w-24" defaultValue="16:00" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="button-bounce">Salvar preferências</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications">Notificações por email</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="appointment-reminders">Lembretes de consultas</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar lembretes de consultas para você
                      </p>
                    </div>
                    <Switch id="appointment-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="patient-reminders">Lembretes para pacientes</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar lembretes automáticos para seus pacientes
                      </p>
                    </div>
                    <Switch id="patient-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="payment-notifications">Notificações de pagamento</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber alertas sobre pagamentos recebidos e pendentes
                      </p>
                    </div>
                    <Switch id="payment-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="new-patient-notifications">Novos pacientes</Label>
                      <p className="text-sm text-muted-foreground">
                        Ser notificado quando um novo paciente for cadastrado
                      </p>
                    </div>
                    <Switch id="new-patient-notifications" defaultChecked />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="button-bounce">Salvar configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
