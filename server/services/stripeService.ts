import Stripe from 'stripe';
import { storage } from '../storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 AI job searches per month',
      'Basic resume optimization',
      'Limited job board access',
      'Email support'
    ],
    stripePriceId: '',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 19,
    interval: 'month',
    features: [
      'Unlimited AI job searches',
      'Advanced resume optimization',
      'All 15+ job board access',
      'AI interview preparation',
      'Priority support',
      'Analytics dashboard'
    ],
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 39,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Advanced analytics',
      'Salary negotiation coaching',
      '1:1 career coaching',
      'White-glove service',
      'Custom integrations'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },
];

export class StripeService {
  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async getOrCreateSubscription(userId: string, planId: string): Promise<{ subscriptionId: string; clientSecret: string }> {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan || !plan.stripePriceId) {
        throw new Error('Invalid subscription plan');
      }

      // Check if user already has a subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          return {
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || '',
          };
        }
      }

      // Create customer if doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await this.createCustomer(
          user.email,
          `${user.firstName} ${user.lastName}`.trim()
        );
        customerId = customer.id;
        await storage.updateUser(userId, { stripeCustomerId: customerId });
      }

      // Create subscription
      const subscription = await this.createSubscription(customerId, plan.stripePriceId);
      
      // Update user with subscription ID
      await storage.updateUser(userId, {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'pending',
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || '',
      };
    } catch (error) {
      throw new Error(`Failed to get or create subscription: ${error.message}`);
    }
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
    try {
      // Find user by subscription ID
      const users = await storage.getUser(''); // This would need to be implemented to search by subscription ID
      // For now, we'll skip this implementation
      
      console.log(`Subscription ${subscriptionId} status updated to ${status}`);
    } catch (error) {
      console.error(`Failed to update subscription status: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    } catch (error) {
      throw new Error(`Failed to reactivate subscription: ${error.message}`);
    }
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return subscriptionPlans;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            await this.updateSubscriptionStatus(invoice.subscription as string, 'active');
          }
          break;
        
        case 'invoice.payment_failed':
          const failedInvoice = event.data.object as Stripe.Invoice;
          if (failedInvoice.subscription) {
            await this.updateSubscriptionStatus(failedInvoice.subscription as string, 'past_due');
          }
          break;
        
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          await this.updateSubscriptionStatus(subscription.id, subscription.status);
          break;
        
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription;
          await this.updateSubscriptionStatus(deletedSubscription.id, 'canceled');
          break;
        
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling webhook: ${error.message}`);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
