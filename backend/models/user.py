from db.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    google_id = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=True)
    picture = Column(String, nullable=True)

    profiles = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    username = Column(String, unique=False, index=True, nullable=False)
    bio = Column(String, nullable=True, default="This user prefers to keep an air of mystery about them.")
    avatar_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)

    user = relationship("User", back_populates="profiles") 

