/**
 * Formato estandarizado de respuestas exitosas
 */
export const successResponse = (data, meta = null) => {
  const response = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Formato estandarizado de respuestas de error
 */
export const errorResponse = (code, message, details = {}) => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
};

/**
 * Helper para crear metadatos de paginación
 */
export const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

