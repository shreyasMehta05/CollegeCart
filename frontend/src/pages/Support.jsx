import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Divider, 
  Avatar, 
  IconButton, 
  CircularProgress, 
  Chip, 
  Fade, 
  Slide,
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Card,
  CardContent,
  InputAdornment,
  useMediaQuery,
  Alert,
  Snackbar,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Send, 
  ExpandMore, 
  QuestionAnswer, 
  Help, 
  ContactSupport, 
  ForumOutlined,
  ChatBubbleOutline,
  Search,
  WhatsApp,
  Email,
  PhoneInTalk,
  ArrowForward,
  AttachFile,
  EmojiEmotions,
  Delete
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { authUtils } from '@/utils/auth';

// Styled components
const ChatMessage = styled(Box)(({ theme, sender }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5, 2),
  borderRadius: sender === 'user' ? '18px 18px 0px 18px' : '18px 18px 18px 0px',
  backgroundColor: sender === 'user' 
    ? alpha(theme.palette.primary.main, 0.1)
    : theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : '#f0f2f5',
  wordBreak: 'break-word',
  marginBottom: theme.spacing(1),
  boxShadow: sender === 'user' 
    ? '0px 2px 8px rgba(0, 0, 0, 0.05)' 
    : '0px 2px 8px rgba(0, 0, 0, 0.05)',
  color: sender === 'user' 
    ? theme.palette.primary.main 
    : theme.palette.text.primary,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    width: '10px',
    height: '10px',
    [sender === 'user' ? 'right' : 'left']: -5,
    borderRadius: '0 0 10px 0',
    backgroundColor: sender === 'user' 
      ? alpha(theme.palette.primary.main, 0.1)
      : theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : '#f0f2f5',
  }
}));

const FAQCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
  },
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(0,0,0,0.06)',
}));

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'faq', 'contact'
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to Order History in your profile section and clicking on the tracking information associated with your order."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, and cash on delivery for most items."
    },
    {
      question: "How do I return a product?",
      answer: "To return a product, go to your Order History, select the order containing the item you want to return, and click on 'Return Item'. Follow the on-screen instructions to complete the return process."
    },
    {
      question: "How can I list my own products for sale?",
      answer: "To list your products, first create a seller account by visiting your profile and clicking on 'Become a Seller'. Once approved, you can list products by clicking on 'Add New Product' from the seller dashboard."
    },
    {
      question: "What are the delivery charges?",
      answer: "Delivery charges vary depending on the product, seller, and your location. The exact delivery charge will be shown at checkout before you confirm your order."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 2-5 business days for most items, depending on your location. Express delivery options may be available for select products."
    },
  ];

  useEffect(() => {
    // Load previous conversations
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const token = authUtils.getToken();
        const response = await axios.get('/api/support/conversation', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.conversation) {
          setConversation(response.data.conversation);
          setMessages(response.data.conversation.messages);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    try {
      setIsSending(true);
      
      // Add message to UI immediately for better UX
      const newUserMessage = {
        text: message,
        sender: 'user',
        timestamp: new Date(),
        attachment: selectedFile ? URL.createObjectURL(selectedFile) : null
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      setSelectedFile(null);
      
      const token = authUtils.getToken();
      let formData = new FormData();
      formData.append('text', message);
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }
      
      if (conversation) {
        formData.append('conversationId', conversation._id);
      }
      
      const response = await axios.post('/api/support/message', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.message) {
        setMessages(prev => {
          // Remove temporary user message and add the real one
          const filtered = prev.filter(msg => msg !== newUserMessage);
          return [...filtered, response.data.message];
        });
        
        // If this was a new conversation, update the conversation state
        if (!conversation && response.data.conversation) {
          setConversation(response.data.conversation);
        }
        
        // If it's a bot response, show it after a small delay
        setTimeout(() => {
          setMessages(prev => [...prev, response.data.botResponse]);
        }, 800);
      }
      
      setIsSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        pt: 2,
        pb: 8,
      }}
    >
      {/* Modern Header Section */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4,
          pt: 5,
          pb: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            fontWeight={800}
            sx={{ 
              backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              mb: 1
            }}
          >
            Customer Support
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            fontWeight={400}
            sx={{ mb: 3, maxWidth: 600 }}
          >
            Need help? Our support team is here to assist you with any questions or issues you may have.
          </Typography>
          
          {/* Tab Navigation */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            {['chat', 'faq', 'contact'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'contained' : 'outlined'}
                onClick={() => setActiveTab(tab)}
                startIcon={
                  tab === 'chat' ? <ChatBubbleOutline /> : 
                  tab === 'faq' ? <Help /> : 
                  <ContactSupport />
                }
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  boxShadow: activeTab === tab ? '0 8px 16px rgba(99, 102, 241, 0.2)' : 'none',
                  borderColor: activeTab !== tab ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
                }}
              >
                {tab === 'chat' ? 'Live Chat' : 
                 tab === 'faq' ? 'FAQs' : 
                 'Contact Us'}
              </Button>
            ))}
          </Box>
          
          {/* Background Elements */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: -30, 
            right: -30, 
            width: 120, 
            height: 120, 
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            zIndex: 0
          }} />
          <Box sx={{ 
            position: 'absolute', 
            top: -15, 
            left: '5%', 
            width: 60, 
            height: 60, 
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            zIndex: 0
          }} />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <AnimatePresence mode="wait">
          {/* Chat Section */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.06)',
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <ForumOutlined />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Support Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {loading ? 'Loading...' : 'We typically reply within minutes'}
                    </Typography>
                  </Box>
                </Box>

                {/* Messages Area */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto', 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          display: 'flex',
                          flexDirection: 'column',
                          mb: 1,
                        }}
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ChatMessage sender={msg.sender}>
                          {msg.text}
                          {msg.attachment && (
                            <Box mt={1}>
                              <img 
                                src={msg.attachment} 
                                alt="Attachment" 
                                style={{ 
                                  maxWidth: '100%', 
                                  maxHeight: 200, 
                                  borderRadius: 8,
                                  border: '1px solid rgba(0,0,0,0.1)'
                                }} 
                              />
                            </Box>
                          )}
                        </ChatMessage>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            mt: 0.5,
                            mx: 1,
                          }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                        px: 3,
                      }}
                    >
                      <QuestionAnswer sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.2), mb: 2 }} />
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        Start a New Conversation
                      </Typography>
                      <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
                        Send a message to our support team and we'll get back to you as soon as possible.
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: '#fff',
                }}>
                  {selectedFile && (
                    <Box 
                      sx={{ 
                        mb: 2, 
                        p: 1, 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                        {selectedFile.name}
                      </Typography>
                      <IconButton size="small" onClick={removeAttachment}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <IconButton onClick={handleAttachFile}>
                      <AttachFile />
                    </IconButton>
                    
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      variant="outlined"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      InputProps={{
                        sx: { 
                          borderRadius: '24px',
                          bgcolor: theme.palette.background.paper,
                          '&:hover': {
                            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                          }
                        }
                      }}
                    />
                    
                    <IconButton 
                      color="primary" 
                      onClick={handleSendMessage}
                      disabled={isSending || (!message.trim() && !selectedFile)}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                        '&.Mui-disabled': {
                          bgcolor: alpha(theme.palette.primary.main, 0.4),
                          color: '#fff',
                        }
                      }}
                    >
                      {isSending ? <CircularProgress size={24} color="inherit" /> : <Send />}
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}
          
          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search FAQs..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '16px',
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      '&:hover': {
                        boxShadow: '0 6px 24px rgba(0,0,0,0.09)'
                      }
                    }
                  }}
                  sx={{ maxWidth: 500 }}
                />
              </Box>
              
              <Grid container spacing={3}>
                {faqs.map((faq, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <FAQCard>
                        <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                          >
                            <Typography fontWeight={600}>{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>{faq.answer}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      </FAQCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
          
          {/* Contact Section */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                        Get in Touch
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Have questions or need assistance? Reach out to us using any of the contact methods below.
                      </Typography>
                      
                      <Box sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <Email />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Email
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              support@collegecart.com
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <PhoneInTalk />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Phone
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              +91 987 654 3210
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            <WhatsApp />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              WhatsApp
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              +91 987 654 3210
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={7}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        borderRadius: '24px',
                        p: 4,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        border: theme.palette.mode === 'dark' 
                          ? '1px solid rgba(255,255,255,0.1)'
                          : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                        Send us a Message
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            label="Name" 
                            variant="outlined" 
                            fullWidth
                            InputProps={{ sx: { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            label="Email" 
                            variant="outlined" 
                            fullWidth
                            InputProps={{ sx: { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField 
                            label="Subject" 
                            variant="outlined" 
                            fullWidth
                            InputProps={{ sx: { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField 
                            label="Message" 
                            variant="outlined" 
                            fullWidth 
                            multiline 
                            rows={4}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="contained" 
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{ 
                              borderRadius: '12px',
                              py: 1.5,
                              px: 3,
                              fontWeight: 600,
                              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
                            }}
                          >
                            Send Message
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
      
      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Support;