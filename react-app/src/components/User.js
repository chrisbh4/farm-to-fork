import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserEditForm from './UserEditForm';
import UserProductsList from './UserProductsList';
import './User.css';

function User() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const history = useHistory();
  const currentUser = useSelector(state => state.session.user);

  // Check if current user can edit this profile
  const canEdit = currentUser && currentUser.id === parseInt(userId);

  useEffect(() => {
    if (!userId) {
      return;
    }
    
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          

        } else {
          // User not found or error
          history.push('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        history.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, history]);

  const handleEditSave = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="user-page">
        <div className="user-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user.id) {
    return (
      <div className="user-page">
        <div className="user-not-found">
          <i className="fas fa-user-slash"></i>
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => history.push('/')}>
            <i className="fas fa-home"></i>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="user-page">
        <div className="user-content">
          <UserEditForm
            user={user}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-content">
        <div className="user-profile-container">
          {/* Profile Header */}
          <div className="user-profile-header">
            <div className="user-avatar-section">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.username}&background=16a34a&color=fff&size=120`}
                alt={user.username}
                className="user-avatar-large"
              />
              <div className="user-status-badge">
                <i className="fas fa-check-circle"></i>
                Verified
              </div>
            </div>
            
            <div className="user-info-section">
              <h1 className="user-display-name">{user.username}</h1>
              <p className="user-email">{user.email}</p>
              <div className="user-meta">
                <span className="user-meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  Member since {new Date().getFullYear()}
                </span>
                <span className="user-meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  Local Farmer
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="user-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Profile Stats */}
          {/* <div className="user-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{userProducts.length}</h3>
                <p className="stat-label">Products Listed</p>
              </div>
            </div>
                        
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
                </h3>
                <p className="stat-label">Member Since</p>
              </div>
            </div>
          </div> */}

          {/* Profile Content */}
          <div className="user-profile-content">
            <div className="profile-section">
              <h2 className="section-title">
                <i className="fas fa-info-circle"></i>
                About
              </h2>
              <div className="section-content">
                <p className="user-bio">
                  Welcome to {user.username}'s profile! This farmer is passionate about providing 
                  fresh, locally-grown produce to the community. All products are grown with care 
                  using sustainable farming practices.
                </p>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">
                <i className="fas fa-seedling"></i>
                {canEdit ? 'My Products' : `${user.username}'s Products`}
              </h2>
              <div className="section-content">
                <UserProductsList userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
