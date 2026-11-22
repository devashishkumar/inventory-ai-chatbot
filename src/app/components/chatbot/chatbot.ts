import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatTurn } from '../../services/chat.service';

interface ChatMessage extends ChatTurn {}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
})
export class ChatbotComponent {
  private readonly chatService = inject(ChatService);

  @ViewChild('messageList') private messageList?: ElementRef<HTMLDivElement>;

  protected readonly isOpen = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly error = signal('');
  protected readonly draft = signal('');
  protected readonly messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! Ask me about products, stock levels, orders, or suppliers—for example, “Which products are low on stock?”',
    },
  ]);

  protected toggleChat(): void {
    this.isOpen.update((open) => !open);
    this.scrollToLatest();
  }

  protected sendMessage(): void {
    const content = this.draft().trim();
    if (!content || this.isLoading()) {
      return;
    }

    const conversation = this.messages().slice(1).slice(-12);
    this.messages.update((messages) => [...messages, { role: 'user', content }]);
    this.draft.set('');
    this.error.set('');
    this.isLoading.set(true);
    this.scrollToLatest();

    this.chatService.sendMessage(content, conversation).subscribe({
      next: (reply) => {
        this.messages.update((messages) => [...messages, { role: 'assistant', content: reply }]);
        this.isLoading.set(false);
        this.scrollToLatest();
      },
      error: () => {
        this.error.set('I could not reach the assistant. Check that the chat API and inventory API are running.');
        this.isLoading.set(false);
      },
    });
  }

  private scrollToLatest(): void {
    setTimeout(() => {
      const element = this.messageList?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
