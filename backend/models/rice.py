from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Boolean, Text, CheckConstraint, UniqueConstraint, Index, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from db.base import Base
import enum

class Rice(Base):
    __tablename__ = "rices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    dotfile_url = Column(String, nullable=False)
    views = Column(Integer, default=0, nullable=False)
    dotfile_clicks = Column(Integer, default=0, nullable=False)
    date_added = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    date_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    
    user = relationship("User", back_populates="rices")
    themes = relationship("Theme", back_populates="rice", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="rice", cascade="all, delete-orphan")

class Theme(Base):
    __tablename__ = "themes"

    id = Column(Integer, primary_key=True, index=True)
    rice_id = Column(Integer, ForeignKey("rices.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
        
    display_order = Column(Integer, nullable=False, default=0)
    tags = Column(String(500), nullable=True)
    date_added = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    rice = relationship("Rice", back_populates="themes")
    media = relationship("ThemeMedia", back_populates="theme", cascade="all, delete-orphan")  

    __table_args__ = (
        Index('ix_themes_rice_order', 'rice_id', 'display_order'),  
    )

class MediaType(enum.Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"

class ThemeMedia(Base):
    __tablename__ = "theme_media"

    id = Column(Integer, primary_key=True, index=True)
    theme_id = Column(Integer, ForeignKey("themes.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(500), nullable=False)  
    media_type = Column(Enum(MediaType), nullable=False)  
    display_order = Column(Integer, nullable=False, default=0)
    thumbnail_url = Column(String(500), nullable=True)
    date_added = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    theme = relationship("Theme", back_populates="media")
    
    __table_args__ = (
        Index('ix_theme_media_order', 'theme_id', 'display_order'),
    )

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rice_id = Column(Integer, ForeignKey("rices.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    date_created = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    date_updated = Column(DateTime(timezone=True), onupdate=func.now())
    helpful_count = Column(Integer, default=0, nullable=False)

    rice = relationship("Rice", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    __table_args__ = (
        UniqueConstraint('rice_id', 'user_id', name='uq_rice_user_review'),
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        Index('ix_reviews_rice_date', 'rice_id', 'date_created'),
    )




