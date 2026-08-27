import { Link } from "react-router";

export function Announce() {
  return (
    <div className="announce">
      <div className="wrap">
        <span>
          <b>New:</b> Florida Theological Seminary is now an accredited
          institution.
        </span>
        <Link to="/accreditation">Read what it means &rsaquo;</Link>
      </div>
    </div>
  );
}
