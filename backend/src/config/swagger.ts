import { env } from './env';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ReWear Enterprise API',
    version: '1.0.0',
    description: `
### Zero-Waste Clothing Swap & Exchange Platform API Gateway

ReWear provides robust RESTful web service endpoints for listing clothing items, managing swap proposals, user profiles, chat messages, and admin telemetry.

#### Authentication
Endpoints requiring authentication accept a Bearer JWT Token in the HTTP Authorization header:
\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`
    `,
    contact: {
      name: 'ReWear Engineering Team',
      url: 'https://rewear-web.onrender.com',
      email: 'support@rewear.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://rewear-api-dm0d.onrender.com',
      description: 'Production Live Render Server',
    },
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token obtained from /api/auth/login or /api/auth/register',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a1234567890abcdef12345' },
          name: { type: 'string', example: 'Alex Rivera' },
          email: { type: 'string', example: 'alex@rewear.com' },
          role: { type: 'string', enum: ['USER', 'MODERATOR', 'ADMIN'], example: 'USER' },
          points: { type: 'number', example: 150 },
          sustainabilityRating: { type: 'number', example: 4.9 },
          avatar: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
          bio: { type: 'string', example: 'Sustainable fashion enthusiast & vintage denim collector.' },
          location: { type: 'string', example: 'Bangalore, India' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Item: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66b9876543210fedcba54321' },
          title: { type: 'string', example: 'Vintage Oversized Denim Jacket' },
          description: { type: 'string', example: 'Pristine 90s vintage Levi jacket with custom eco-embroidery.' },
          category: { type: 'string', example: 'Outerwear' },
          type: { type: 'string', enum: ['SWAP', 'POINTS', 'DONATION'], example: 'SWAP' },
          size: { type: 'string', example: 'L' },
          condition: { type: 'string', example: 'Like New' },
          images: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2'],
          },
          tags: { type: 'array', items: { type: 'string' }, example: ['Vintage', 'Denim', 'Unisex'] },
          pointValue: { type: 'number', example: 45 },
          valueEstimate: { type: 'number', example: 120 },
          status: { type: 'string', enum: ['AVAILABLE', 'PENDING', 'SWAPPED'], example: 'AVAILABLE' },
          owner: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Swap: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66c111222333444555666777' },
          requester: { $ref: '#/components/schemas/User' },
          receiver: { $ref: '#/components/schemas/User' },
          requestedItem: { $ref: '#/components/schemas/Item' },
          offeredItems: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
          status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'], example: 'PENDING' },
          notes: { type: 'string', example: 'Would love to swap for this jacket!' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Server Health Diagnostic Check',
        tags: ['System'],
        responses: {
          200: {
            description: 'API Gateway is operational',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'UP' },
                    service: { type: 'string', example: 'ReWear Enterprise API Gateway' },
                    environment: { type: 'string', example: 'production' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register New User Account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Rivera' },
                  email: { type: 'string', example: 'alex@rewear.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['USER', 'MODERATOR', 'ADMIN'], example: 'USER' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User account created successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Authenticate User Credentials',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'alex@rewear.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful, returns JWT access token & user profile' },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Refresh Expired Access Token',
        tags: ['Authentication'],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token refreshed successfully' },
          401: { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout & Invalidate Refresh Token',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get Current Authenticated User Profile',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Authenticated profile' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/items': {
      get: {
        summary: 'Search & Filter Clothing Items',
        tags: ['Clothing Items'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'size', in: 'query', schema: { type: 'string' } },
          { name: 'condition', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: {
          200: { description: 'List of items with pagination metadata' },
        },
      },
      post: {
        summary: 'List a New Garment for Swap',
        tags: ['Clothing Items'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'category', 'size', 'condition'],
                properties: {
                  title: { type: 'string', example: 'Nike Air Jordan High Retro' },
                  description: { type: 'string', example: 'Pristine sneakers worn twice.' },
                  category: { type: 'string', example: 'Footwear' },
                  type: { type: 'string', enum: ['SWAP', 'POINTS', 'DONATION'], example: 'SWAP' },
                  size: { type: 'string', example: 'UK 9' },
                  condition: { type: 'string', example: 'Like New' },
                  images: { type: 'array', items: { type: 'string' } },
                  tags: { type: 'array', items: { type: 'string' } },
                  pointValue: { type: 'number', example: 50 },
                  valueEstimate: { type: 'number', example: 150 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Item listed successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/items/{id}': {
      get: {
        summary: 'Get Detailed Garment Specifications',
        tags: ['Clothing Items'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Item details' },
          404: { description: 'Item not found' },
        },
      },
      put: {
        summary: 'Update Garment Listing',
        tags: ['Clothing Items'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Item updated successfully' },
        },
      },
      delete: {
        summary: 'Remove Listing',
        tags: ['Clothing Items'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Item deleted' },
        },
      },
    },
    '/api/swaps': {
      get: {
        summary: 'Get My Active Swap Proposals',
        tags: ['Swaps & Exchanges'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User swap history' },
        },
      },
      post: {
        summary: 'Propose a New Garment Swap',
        tags: ['Swaps & Exchanges'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['requestedItemId', 'offeredItemIds'],
                properties: {
                  requestedItemId: { type: 'string', example: '66b9876543210fedcba54321' },
                  offeredItemIds: { type: 'array', items: { type: 'string' } },
                  notes: { type: 'string', example: 'Let us meet in Indiranagar for direct trade!' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Swap proposal submitted' },
        },
      },
    },
    '/api/swaps/{id}/status': {
      patch: {
        summary: 'Accept, Reject, Complete, or Cancel Swap',
        tags: ['Swaps & Exchanges'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Swap status updated' },
        },
      },
    },
    '/api/users/profile': {
      get: {
        summary: 'Get Profile Details',
        tags: ['User Profile'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile details' },
        },
      },
      put: {
        summary: 'Update Profile Details',
        tags: ['User Profile'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile updated' },
        },
      },
    },
    '/api/admin/dashboard': {
      get: {
        summary: 'Get Platform Telemetry & Overview Stats',
        tags: ['Admin & Governance'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Platform analytics data' },
        },
      },
    },
    '/api/seed': {
      get: {
        summary: 'Seed Demo Products & Swappers Dataset',
        tags: ['System'],
        responses: {
          200: { description: 'Demo data seeded' },
        },
      },
    },
  },
};
