import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect } from 'react';
import GradeIcon from '@mui/icons-material/Grade';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import styles from './ProductDetailPage.module.css';

import { useGetProductByIdQuery } from '@/features/products/api/productsApi';
import Loader from '@/shared/ui/Loader/Loader';
import ErrorMessage from '@/shared/ui/ErrorMessage/ErrorMessage';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId, {
    skip: isNaN(productId),
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = product ? product.images : [];

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  if (isLoading) return <Loader />;
  if (isError || !product) return <ErrorMessage message={t('products.loadingError')} />;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="small" /> {t('common.back')}
      </button>
      <article className={styles.card}>
        <figure key={productId} className={styles.images} aria-label={t('products.gallery')}>
          <button
            className={styles.mainImageBtn}
            onClick={() => openLightbox(activeIndex)}
            aria-label={t('products.openImage')}
            title={t('products.openImage')}
          >
            <img src={allImages[activeIndex]} alt={product.title} className={styles.mainImage} />
            <span className={styles.zoomHint}>
              {' '}
              <SearchIcon />{' '}
            </span>
          </button>

          {allImages.length > 1 && (
            <div className={styles.imageThumbs} role="list">
              {allImages.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumbBtn} ${i === activeIndex ? styles.thumbActive : ''}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`${t('products.image')} ${i + 1}`}
                  aria-pressed={i === activeIndex}
                >
                  <img
                    src={img}
                    alt={`${product.title} - ${t('products.image')} ${i + 1}`}
                    className={styles.thumb}
                  />
                </button>
              ))}
            </div>
          )}
        </figure>

        <div className={styles.details}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          {product.brand && (
            <p className={styles.brand}>
              {t('products.brand')}: <strong>{product.brand}</strong>
            </p>
          )}
          <p className={styles.description}>{product.description}</p>
          <div className={styles.metaRow}>
            <span className={styles.price}>${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className={styles.discount}>-{product.discountPercentage.toFixed(0)}%</span>
            )}
            <span className={styles.rating}>
              <GradeIcon fontSize="small" sx={{ verticalAlign: 'middle', color: '#f43f5e' }} />{' '}
              {product.rating.toFixed(1)}
            </span>
          </div>
          <dl className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <dt className={styles.infoLabel}>{t('products.stock')}</dt>
              <dd>{product.stock}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt className={styles.infoLabel}>{t('products.category')}</dt>
              <dd>{product.category}</dd>
            </div>
          </dl>
          {product.reviews.length > 0 && (
            <section className={styles.reviews}>
              <h3>{t('products.reviews')}</h3>
              <div className={styles.reviewList}>
                {product.reviews.map((review, i) => (
                  <article key={i} className={styles.review}>
                    <header className={styles.reviewHeader}>
                      <strong>{review.reviewerName}</strong>
                      <span>
                        <GradeIcon
                          fontSize="small"
                          sx={{ verticalAlign: 'middle', color: '#f43f5e' }}
                        />{' '}
                        {review.rating}
                      </span>
                    </header>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      {lightboxOpen && (
        <button
          type="button"
          className={styles.lightboxOverlay}
          onClick={closeLightbox}
          aria-label={t('products.closeGallery')}
        >
          <div
            className={styles.lightboxContent}
            onClick={e => e.stopPropagation()}
            role="presentation"
          >
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label={t('products.closeGallery')}
            >
              <CloseIcon />
            </button>

            {allImages.length > 1 && (
              <button
                className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                onClick={lightboxPrev}
                aria-label={t('products.prevImage')}
              >
                <ArrowBackIosNewIcon />
              </button>
            )}

            <img
              src={allImages[lightboxIndex]}
              alt={`${product.title} - ${t('products.image')} ${lightboxIndex + 1}`}
              className={styles.lightboxImage}
            />

            {allImages.length > 1 && (
              <button
                className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                onClick={lightboxNext}
                aria-label={t('products.nextImage')}
              >
                <ArrowForwardIosIcon />
              </button>
            )}

            <p className={styles.lightboxCounter}>
              {t('products.imageOf', { current: lightboxIndex + 1, total: allImages.length })}
            </p>
          </div>
        </button>
      )}
    </div>
  );
};

export default ProductDetailPage;
