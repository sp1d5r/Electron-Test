import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Plus, Check, Upload, Users, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../../shadcn/input";
import { ChatData } from "../../../types/Chat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shadcn/table";

interface Steps {
    title: string;
    subtitle: string;
    completed: boolean;
}

interface AnimationState {
  isProcessing: boolean;
  currentAnimationStep: number;
}

export interface NewChatModalProps {
    onFinish: (chatData: ChatData) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ onFinish }) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatData, setChatData] = useState<ChatData>({
    platform: null,
    conversationType: null,
    chatFile: null,
    members: []
  });
  const [newMember, setNewMember] = useState('');
  const [animationState, setAnimationState] = useState<AnimationState>({
    isProcessing: false,
    currentAnimationStep: 0,
  });
  const [detectedNames, setDetectedNames] = useState<string[]>([]);
  const [nameMapping, setNameMapping] = useState<Record<string, string>>({});
  const [filePreview, setFilePreview] = useState<string>('');
  
  const steps: Steps[] = [
    {
        title: "Select Platform",
        subtitle: "Choose your chat platform",
        completed: !!chatData.platform
    },
    {
        title: "Conversation Type",
        subtitle: "What kind of conversation is this?",
        completed: !!chatData.conversationType
    },
    {
        title: "Upload Chat",
        subtitle: "Upload your chat export",
        completed: !!chatData.chatFile
    },
    {
        title: "Add Members",
        subtitle: "Add the members of the conversation",
        completed: chatData.members.length > 0
    },
    {
        title: "Map Names",
        subtitle: "Match members to their chat names",
        completed: chatData.members.every(member => nameMapping[member])
    }
  ];

  const handlePlatformSelect = (platform: string) => {
    setChatData(prev => ({ ...prev, platform }));
    handleNext();
  };

  const handleTypeSelect = (type: string) => {
    setChatData(prev => ({ ...prev, conversationType: type }));
    handleNext();
  };

  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    setFilePreview(text);
    setChatData(prev => ({ ...prev, chatFile: file }));
    handleNext();
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddMember = () => {
    if (newMember.trim() && !chatData.members.includes(newMember.trim())) {
      setChatData(prev => ({
        ...prev,
        members: [...prev.members, newMember.trim()]
      }));
      setNewMember('');
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    setChatData(prev => ({
      ...prev,
      members: prev.members.filter(member => member !== memberToRemove)
    }));
    if (nameMapping[memberToRemove]) {
      const { [memberToRemove]: _, ...rest } = nameMapping;
      setNameMapping(rest);
    }
  };

  const handleNameMapping = (originalName: string, mappedName: string) => {
    setNameMapping(prev => ({
      ...prev,
      [originalName]: mappedName
    }));
  };

  const handleSubmitAnimation = async () => {
    const finalChatData = {
      ...chatData,
      nameMapping
    };
    
    setAnimationState({ isProcessing: true, currentAnimationStep: 0 });
    const processingPromise = onFinish(finalChatData);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationState(prev => ({ ...prev, currentAnimationStep: 1 }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationState(prev => ({ ...prev, currentAnimationStep: 2 }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationState(prev => ({ ...prev, currentAnimationStep: 3 }));
    
    await Promise.all([
        processingPromise,
        new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    setOpen(false);
    resetModalState();
    setAnimationState({ isProcessing: false, currentAnimationStep: 0 });
  };

  const resetModalState = () => {
    setCurrentStep(0);
    setChatData({
      platform: null,
      conversationType: null,
      chatFile: null,
      members: []
    });
    setNewMember('');
    setAnimationState({
      isProcessing: false,
      currentAnimationStep: 0,
    });
  };

  const getHighlightedText = (text: string) => {
    if (!text || !chatData.members.length) return text;
    
    let highlightedText = text;
    chatData.members.forEach(member => {
      const originalName = nameMapping[member] || member;
      const regex = new RegExp(`\\[\\d{2}/\\d{2}/\\d{2},\\s\\d{2}:\\d{2}:\\d{2}\\]\\s${originalName}:`, 'g');
      highlightedText = highlightedText.replace(regex, match => 
        `<span class="bg-primary/20">${match}</span>`
      );
    });
    
    return highlightedText;
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetModalState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-auto w-full justify-start text-left max-w-[350px]"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center">
            <div className="mr-3 text-2xl"><Plus /></div>
            <div>
              <div className="font-bold">Create New Conversation</div>
              <div className="text-sm text-muted-foreground">Analyse a new conversation.</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[80%] dark:text-white flex flex-row p-0 overflow-hidden">
        <motion.div 
          className={`${
            animationState.isProcessing ? 'w-full' : 'w-[20%]'
          } h-[80vh] bg-gradient-to-b from-primary to-accent p-4 flex flex-col gap-4 py-6 relative`}
          animate={{ width: animationState.isProcessing ? '100%' : '20%' }}
          transition={{ duration: 0.5 }}
        >
          {!animationState.isProcessing && (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <p className="text-2xl font-bold text-black">Steps</p>
                    <p className="text-sm text-muted-foreground">Follow the steps to create a new analysis.</p>
                </div>
              </div>
              {
                steps.map((step, index) => (
                  <div className="flex flex-row gap-2 items-center text-black">
                    <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                      {index < currentStep ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <p className="font-bold">{index + 1}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold">{step.title}</p>
                    </div>
                  </div>
                ))
              }
            </>
          )}

          {animationState.isProcessing && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              
              <motion.div className="text-center w-full relative h-[100px]">
                {[
                  `Selected ${chatData.platform} as your platform`,
                  `Picked ${chatData.conversationType} conversation type`,
                  `Added ${chatData.members.length} members to analyze`,
                  "Securely processing your chat, sit tight while we work our magic"
                ].map((text, index) => (
                  <motion.p
                    key={index}
                    className="absolute left-0 right-0 text-xl font-bold text-black px-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: animationState.currentAnimationStep === index ? 1 : 0,
                      y: animationState.currentAnimationStep === index ? 0 : 
                         animationState.currentAnimationStep > index ? -10 : 10
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {!animationState.isProcessing && (
            <motion.div 
                className="w-[80%] h-[80vh] p-4 py-6 flex flex-col gap-2"
                exit={{ opacity: 0 }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {steps[currentStep].title}
                    </DialogTitle>
                    <DialogDescription>
                        {steps[currentStep].subtitle}
                    </DialogDescription>
                </DialogHeader>
            
                <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid gap-4 py-4"
                >
                    {currentStep === 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            <Button 
                                variant={chatData.platform === 'whatsapp' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                onClick={() => handlePlatformSelect('whatsapp')}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">WhatsApp</span>
                                    <span className="text-sm text-muted-foreground">Upload a WhatsApp chat export</span>
                                </div>
                            </Button>
                            
                            <Button 
                                variant={chatData.platform === 'messenger' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                onClick={() => handlePlatformSelect('messenger')}
                                disabled
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">Facebook Messenger</span>
                                    <span className="text-sm text-muted-foreground">Connect your Messenger account</span>
                                </div>
                            </Button>
                            
                            <Button 
                                variant={chatData.platform === 'discord' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                disabled
                                onClick={() => handlePlatformSelect('discord')}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">Discord</span>
                                    <span className="text-sm text-muted-foreground">Connect your Discord server</span>
                                </div>
                            </Button>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-4">
                            <Button 
                                variant={chatData.conversationType === 'significant_other' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                onClick={() => handleTypeSelect('significant_other')}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">Significant Other</span>
                                    <span className="text-sm text-muted-foreground">Analyze conversations with your partner</span>
                                </div>
                            </Button>
                            
                            <Button 
                                variant={chatData.conversationType === 'friends' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                onClick={() => handleTypeSelect('friends')}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">Friends</span>
                                    <span className="text-sm text-muted-foreground">Analyze group or individual chats with friends</span>
                                </div>
                            </Button>

                            <Button 
                                variant={chatData.conversationType === 'family' ? 'default' : 'outline'}
                                className="h-auto p-4 justify-start"
                                onClick={() => handleTypeSelect('family')}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">Family</span>
                                    <span className="text-sm text-muted-foreground">Analyze group or individual chats with family members</span>
                                </div>
                            </Button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex flex-col gap-4">
                            <div 
                                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    handleFileUpload(file);
                                }}
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) handleFileUpload(file);
                                    };
                                    input.click();
                                }}
                            >
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2">
                                    {chatData.chatFile ? 
                                        chatData.chatFile.name : 
                                        'Drag and drop your chat export here or click to browse'
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2 items-center mb-4">
                                <Users className="h-6 w-6" />
                                <p className="text-lg font-medium">Add Members</p>
                                <p className="text-sm text-muted-foreground w-full mt-2">
                                    Add the members who participated in this conversation
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter member name"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddMember();
                                        }
                                    }}
                                />
                                <Button onClick={handleAddMember}>Add</Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {chatData.members.map((member) => (
                                    <div
                                        key={member}
                                        className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                                    >
                                        <span>{member}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1 hover:bg-destructive/20"
                                            onClick={() => handleRemoveMember(member)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="flex flex-col gap-4 max-h-[60vh] overflow-hidden">
                            <div className="flex flex-wrap gap-2 items-center mb-4">
                                <Users className="h-6 w-6" />
                                <p className="text-lg font-medium">Map Member Names</p>
                                <p className="text-sm text-muted-foreground w-full mt-2">
                                    Enter the names as they appear in your chat for each member
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                                <div className="overflow-y-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Member</TableHead>
                                                <TableHead>Name in Chat</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {chatData.members.map((member) => (
                                                <TableRow key={member}>
                                                    <TableCell>{member}</TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className="w-full"
                                                            placeholder="Enter name as it appears in chat"
                                                            value={nameMapping[member] || ''}
                                                            onChange={(e) => handleNameMapping(member, e.target.value)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex flex-col min-h-0">
                                    <p className="text-sm font-medium mb-2">Chat Preview</p>
                                    <div 
                                        className="flex-1 border rounded-md p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ 
                                            __html: getHighlightedText(filePreview)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="flex flex-row gap-2 flex-1" />

                <div className="flex flex-row gap-2 w-full justify-between items-center">
                    <Button 
                        variant="outline" 
                        onClick={handleBack}
                        disabled={currentStep === 0}
                    >
                        <p className="font-bold">Back</p>
                    </Button>
                    <Button 
                        onClick={() => {
                            if (currentStep === steps.length - 1) {
                                handleSubmitAnimation();
                            } else {
                                handleNext();
                            }
                        }}
                        disabled={
                            (currentStep === 0 && !chatData.platform) ||
                            (currentStep === 1 && !chatData.conversationType) ||
                            (currentStep === 2 && !chatData.chatFile)
                        }
                    >
                        <p className="font-bold">
                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </p>
                    </Button>
                </div>
            </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};