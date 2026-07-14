import { Component, inject, signal, effect, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export interface ChatMessage {
  id: string;
  sender: 'operator' | 'support';
  senderName: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="chat-wrapper animate-fade-in-up">
      <!-- Section Header -->
      <div class="page-header">
        <h2 class="section-title">Support Console Chat</h2>
        <p class="section-subtitle">Real-time collaboration channel with system support agents.</p>
      </div>

      <!-- Chat Container Grid -->
      <div class="chat-grid glass-card">
        <!-- Left Sidebar: Conversations list -->
        <aside class="chat-sidebar">
          <div class="sidebar-search">
            <span class="search-icon">🔍</span>
            <input type="text" class="form-control" placeholder="Search conversations..." />
          </div>
          <div class="conversations-list">
            <div class="conversation-item active">
              <div class="item-avatar">S</div>
              <div class="item-details">
                <div class="item-header">
                  <h4>System Tech Support</h4>
                  <span class="time">Active</span>
                </div>
                <p class="preview-text">Connected to Gateway Server</p>
              </div>
            </div>
            <div class="conversation-item offline">
              <div class="item-avatar">C</div>
              <div class="item-details">
                <div class="item-header">
                  <h4>Client Helpline</h4>
                  <span class="time">Offline</span>
                </div>
                <p class="preview-text">Helpline will resume at 8:00 AM</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Pane: Active Chat Room -->
        <section class="chat-room">
          <!-- Chat Room Header -->
          <header class="room-header">
            <div class="room-details">
              <div class="status-indicator-active"></div>
              <div>
                <h3>System Tech Support Agent</h3>
                <p class="sub-text">Assigned Operator Assistant</p>
              </div>
            </div>
            <div class="room-actions">
              <span class="badge-status">System Operational</span>
            </div>
          </header>

          <!-- Chat Message Thread -->
          <div class="message-thread" #messageThread>
            @for (msg of messages(); track msg.id) {
              <div class="message-bubble-row" [class.outgoing]="msg.sender === 'operator'">
                <div class="bubble-avatar">
                  {{ msg.senderName.substring(0, 1) }}
                </div>
                <div class="bubble-content-wrapper">
                  <div class="bubble-sender-name">{{ msg.senderName }}</div>
                  <div class="bubble-text">{{ msg.content }}</div>
                  <div class="bubble-timestamp">
                    {{ msg.timestamp | date:'shortTime' }}
                  </div>
                </div>
              </div>
            }

            @if (isTyping()) {
              <div class="typing-indicator-row">
                <div class="indicator-bubble">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
                <span class="typing-text">Agent is formulating response...</span>
              </div>
            }
          </div>

          <!-- Quick Suggestions Bar -->
          <div class="suggestions-bar">
            @for (chip of suggestions; track chip) {
              <button class="suggestion-chip" (click)="onSuggestionClick(chip)">
                {{ chip }}
              </button>
            }
          </div>

          <!-- Message Input controls -->
          <footer class="input-panel">
            <input 
              type="text" 
              [formControl]="inputControl" 
              (keydown.enter)="sendMessage()"
              placeholder="Type your system query here..." 
              class="form-control message-input" 
              id="chat-input-field"
            />
            <button (click)="sendMessage()" class="btn btn-primary send-btn" id="btn-send-message">
              Send ➔
            </button>
          </footer>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .chat-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
      height: calc(100vh - 140px);
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 700;
    }

    .section-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    /* Layout structure */
    .chat-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      flex: 1;
      height: 100%;
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .chat-grid {
        grid-template-columns: 1fr;
      }
      .chat-sidebar {
        display: none;
      }
    }

    /* Left Sidebar */
    .chat-sidebar {
      background: rgba(15, 23, 42, 0.4);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
    }

    .sidebar-search {
      padding: 16px;
      position: relative;
      border-bottom: 1px solid var(--glass-border);
    }

    .sidebar-search .search-icon {
      position: absolute;
      left: 28px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    .sidebar-search input {
      padding-left: 36px;
      font-size: 0.85rem;
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--glass-border);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .conversation-item:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .conversation-item.active {
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid var(--color-primary);
    }

    .item-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--color-primary);
    }

    .conversation-item.active .item-avatar {
      background: var(--color-primary);
      color: #fff;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .item-header h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-header .time {
      font-size: 0.7rem;
      color: var(--color-success);
      font-weight: 600;
    }

    .conversation-item.offline .item-header .time {
      color: var(--text-muted);
    }

    .preview-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Right Chat Room */
    .chat-room {
      display: flex;
      flex-direction: column;
      background: rgba(19, 26, 48, 0.2);
    }

    .room-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15, 23, 42, 0.4);
    }

    .room-details {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator-active {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-success);
      box-shadow: 0 0 8px var(--color-success);
    }

    .room-details h3 {
      font-size: 0.95rem;
      font-weight: 600;
    }

    .room-details .sub-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .badge-status {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--color-success);
      font-weight: 600;
    }

    /* Message Thread */
    .message-thread {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .message-bubble-row {
      display: flex;
      gap: 12px;
      max-width: 75%;
    }

    .message-bubble-row.outgoing {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .bubble-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-secondary);
      flex-shrink: 0;
    }

    .message-bubble-row.outgoing .bubble-avatar {
      background: var(--color-primary);
      color: #fff;
    }

    .bubble-content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bubble-sender-name {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .message-bubble-row.outgoing .bubble-sender-name {
      text-align: right;
    }

    .bubble-text {
      padding: 12px 16px;
      border-radius: 0 var(--border-radius-md) var(--border-radius-md) var(--border-radius-md);
      background: var(--bg-secondary);
      border: 1px solid var(--glass-border);
      font-size: 0.9rem;
      line-height: 1.4;
      color: var(--text-primary);
      word-break: break-word;
    }

    .message-bubble-row.outgoing .bubble-text {
      border-radius: var(--border-radius-md) 0 var(--border-radius-md) var(--border-radius-md);
      background: linear-gradient(135deg, var(--color-primary) 0%, rgba(59, 130, 246, 0.7) 100%);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .bubble-timestamp {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .message-bubble-row.outgoing .bubble-timestamp {
      text-align: right;
    }

    /* Typing indicator */
    .typing-indicator-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .indicator-bubble {
      background: var(--bg-secondary);
      border: 1px solid var(--glass-border);
      padding: 10px 14px;
      border-radius: 20px;
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .indicator-bubble .dot {
      width: 6px;
      height: 6px;
      background-color: var(--text-muted);
      border-radius: 50%;
      animation: bounce 1.2s infinite ease-in-out;
    }

    .indicator-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
    .indicator-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }

    .typing-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Suggestions */
    .suggestions-bar {
      padding: 8px 24px;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      background: rgba(15, 23, 42, 0.2);
      border-top: 1px solid var(--glass-border);
      scrollbar-width: none; /* Hide scrollbar */
    }

    .suggestions-bar::-webkit-scrollbar {
      display: none;
    }

    .suggestion-chip {
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .suggestion-chip:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    /* Input Panel */
    .input-panel {
      padding: 16px 24px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      gap: 12px;
      background: rgba(15, 23, 42, 0.4);
    }

    .message-input {
      flex: 1;
      background: rgba(10, 14, 26, 0.6);
      border-radius: var(--border-radius-sm);
    }

    .send-btn {
      white-space: nowrap;
      padding: 0 20px;
    }
  `]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messageThread') private threadContainer!: ElementRef;

  // Reactively track message thread
  messages = signal<ChatMessage[]>([
    {
      id: '1',
      sender: 'support',
      senderName: 'System Bot',
      content: 'Welcome to the MicroFinance Operator Assistance Terminal. Ask me system queries.',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '2',
      sender: 'support',
      senderName: 'Support Agent (Sarah)',
      content: 'Hello Operator Shankar! I am monitoring the API gateway. How can I assist you with client ledgers today?',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  isTyping = signal(false);
  inputControl = new FormControl('');

  suggestions = [
    'How do I update KYC details?',
    'Verify client list pagination',
    'Is the Discovery Server online?',
    'Simulate loan disbursement stats'
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    const content = this.inputControl.value?.trim();
    if (!content) return;

    // Append operator message
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'operator',
      senderName: 'Operator',
      content: content,
      timestamp: new Date()
    };

    this.messages.update(list => [...list, newMsg]);
    this.inputControl.reset();
    
    // Simulate support response
    this.simulateAgentReply(content);
  }

  onSuggestionClick(suggestionText: string) {
    this.inputControl.setValue(suggestionText);
    this.sendMessage();
  }

  private simulateAgentReply(operatorQuery: string) {
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      let responseText = "I've checked the ledger. Let me know if you require further synchronization.";

      const query = operatorQuery.toLowerCase();
      if (query.includes('kyc') || query.includes('update')) {
        responseText = "To update client KYC details, head to the Clients Directory, click 'Edit' next to their record, adjust their gender, income, or marital status enums, and click 'Update Record'.";
      } else if (query.includes('pagination') || query.includes('table')) {
        responseText = "The client list pagination relies on Spring Boot pageable objects. The client-service Controller dynamically accepts page index, page size, and sorting columns to slice data from the PostgreSQL database.";
      } else if (query.includes('discovery') || query.includes('online')) {
        responseText = "Affirmative, Shankar. The Netflix Eureka Discovery Server is actively running on port 8761 and routing services dynamically via Port 8080 API Gateway.";
      } else if (query.includes('disbursement') || query.includes('disburse')) {
        responseText = "Disbursements data indicates a monthly average of $150k. Total cumulative disbursement has surpassed $1.84M this fiscal quarter.";
      }

      const agentMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'support',
        senderName: 'Support Agent (Sarah)',
        content: responseText,
        timestamp: new Date()
      };

      this.messages.update(list => [...list, agentMsg]);
    }, 1200);
  }

  private scrollToBottom(): void {
    try {
      this.threadContainer.nativeElement.scrollTop = this.threadContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
