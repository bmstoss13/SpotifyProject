export default function LikedSongs() {
    return (
        <div className="liked-songs">
            <h1>Liked Songs</h1>
            <p>Your liked songs will appear here.</p>
            {/* Placeholder for liked songs list */}
            <div className="song-list">
                {/* Example song item */}
                <div className="song-item">
                    <img src="https://via.placeholder.com/150" alt="Song Cover" />
                    <div className="song-info">
                        <h3>Song Title</h3>
                        <p>Artist Name</p>
                    </div>
                </div>
            </div>
        </div>
    );
}