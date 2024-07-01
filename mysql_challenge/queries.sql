-- Find all projects with a deadline before December 1st, 2024.
SELECT * FROM Projects WHERE Deadline < '2024-12-01';

-- List all projects for "Big Retail Inc." ordered by deadline.
SELECT * FROM Projects p 
JOIN Clients ON ClientID = ClientID 
WHERE ClientName = 'Big Retail Inc.' ORDER BY Deadline;

-- Find the team lead for the "Mobile App for Learning" project.
SELECT EmployeeName FROM Employees 
JOIN ProjectTeam ON EmployeeID = EmployeeID 
JOIN Projects ON ProjectID = ProjectID 
WHERE ProjectName = 'Mobile App for Learning' AND TeamLead = 'Yes';

-- Find projects containing "Management" in the name.
SELECT * FROM Projects WHERE ProjectName LIKE '%Management%';


-- Count the number of projects assigned to David Lee.
SELECT COUNT(DISTINCT ProjectID) AS ProjectCount
FROM ProjectTeam
JOIN Employees ON EmployeeID = EmployeeID
WHERE EmployeeName = 'David Lee';


-- Find the total number of employees working on each project.
SELECT ProjectName, COUNT(EmployeeID) AS EmployeeCount FROM Projects 
JOIN TeamMembers ON ProjectID = ProjectID GROUP BY ProjectName;

-- Find all clients with projects having a deadline after October 31st, 2024.
SELECT DISTINCT * FROM Clients JOIN Projects ON ClientID = ClientID WHERE Deadline > '2024-10-31';

-- List employees who are not currently team leads on any project.
SELECT * FROM Employees WHERE EmployeeID NOT IN ( SELECT EmployeeID FROM ProjectTeam WHERE TeamLead = 'Yes' );

-- Combine a list of projects with deadlines before December 1st and another list with "Management" in the project name.
SELECT * FROM Projects 
WHERE Deadline < '2024-12-01' 
UNION 
SELECT * FROM Projects WHERE ProjectName LIKE '%Management%';

-- Display a message indicating if a project is overdue (deadline passed).
SELECT ProjectName,
       CASE WHEN Deadline < CURRENT_DATE THEN 'Overdue'
            ELSE 'On Schedule'
       END AS Status
FROM Projects;


-- Create a view to simplify retrieving client contact 
CREATE VIEW ClientContact AS
SELECT ClientName, ContactName, ContactEmail
FROM Clients;


-- Create a view to show only ongoing projects (not yet completed).
CREATE VIEW OngoingProjects AS
SELECT * FROM Projects WHERE Deadline >= CURRENT_DATE;


-- Create a view to display project information along with assigned team leads.
CREATE VIEW ProjectWithTeamLeads AS
SELECT ProjectName, EmployeeName AS TeamLead
FROM Projects
JOIN ProjectTeam ON ProjectID = ProjectID
JOIN Employees ON EmployeeID = EmployeeID
WHERE TeamLead = 'Yes';


-- Create a view to show project names and client contact information for projects with a deadline in November 2024.
CREATE VIEW NovemberProjects AS
SELECT ProjectName, ContactName, ContactEmail
FROM Projects
JOIN Clients ON ClientID = ClientID
WHERE Deadline BETWEEN '2024-11-01' AND '2024-11-30';


-- Create a view to display the total number of projects assigned to each employee.
CREATE VIEW EmployeeProjectCount AS
SELECT EmployeeName, COUNT(DISTINCT ProjectID) AS ProjectCount
FROM Employees
JOIN ProjectTeam ON EmployeeID = EmployeeID
GROUP BY EmployeeName;


--  Create a function to calculate the number of days remaining until a project deadline
CREATE FUNCTION DaysUntilDeadline(ProjectID INT) RETURNS INT
BEGIN
    DECLARE days_left INT;
    SELECT DATEDIFF(Deadline, CURRENT_DATE) INTO days_left
    FROM Projects WHERE ProjectID = ProjectID;
    RETURN days_left;
END;


-- Create a function to calculate the number of days a project is overdue
CREATE FUNCTION DaysOverdue(ProjectID INT) RETURNS INT
BEGIN
    DECLARE days_overdue INT;
    SELECT DATEDIFF(CURRENT_DATE, Deadline) INTO days_overdue
    FROM Projects WHERE ProjectID = ProjectID AND Deadline < CURRENT_DATE;
    RETURN days_overdue;
END;


-- Create a stored procedure to add a new client and their first project in one call
CREATE PROCEDURE AddClientWithProject(
    IN clientName VARCHAR(255),
    IN contactName VARCHAR(255),
    IN contactEmail VARCHAR(255),
    IN projectName VARCHAR(255),
    IN requirements TEXT,
    IN deadline DATE
)
BEGIN
    DECLARE newClientID INT;
    INSERT INTO Clients (ClientName, ContactName, ContactEmail)
    VALUES (clientName, contactName, contactEmail);
    SET newClientID = LAST_INSERT_ID();
    INSERT INTO Projects (ProjectName, Requirements, Deadline, ClientID)
    VALUES (projectName, requirements, deadline, newClientID);
END;


-- Create a stored procedure to move completed projects (past deadlines) to an archive table
CREATE PROCEDURE ArchiveCompletedProjects()
BEGIN
    INSERT INTO ProjectsArchive (ProjectID, ProjectName, Requirements, Deadline, ClientID)
    SELECT ProjectID, ProjectName, Requirements, Deadline, ClientID
    FROM Projects WHERE Deadline < CURRENT_DATE;
    DELETE FROM Projects WHERE Deadline < CURRENT_DATE;
END;


-- Create a trigger to log any updates made to project records in a separate table for auditing purposes
CREATE TRIGGER LogProjectUpdates
AFTER UPDATE ON Projects
FOR EACH ROW
BEGIN
    INSERT INTO ProjectAudit (ProjectID, OldDeadline, NewDeadline, UpdateTime)
    VALUES (OLD.ProjectID, OLD.Deadline, NEW.Deadline, NOW());
END;


-- Create a trigger to ensure a team lead assigned to a project is a valid employee
CREATE TRIGGER CheckValidTeamLead
BEFORE INSERT ON ProjectTeam
FOR EACH ROW
BEGIN
    DECLARE empCount INT;
    SELECT COUNT(*) INTO empCount
    FROM Employees WHERE EmployeeID = NEW.EmployeeID;
    IF empCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid team lead: employee does not exist';
    END IF;
END;


-- Create a view to display project details along with the total number of team members assigned
CREATE VIEW ProjectTeamMemberCount AS
SELECT ProjectName, COUNT(EmployeeID) AS TeamMemberCount
FROM Projects
JOIN TeamMembers ON ProjectID = ProjectID
GROUP BY ProjectName;


-- Create a view to show overdue projects with the number of days overdue
CREATE VIEW OverdueProjects AS
SELECT ProjectName, DATEDIFF(CURRENT_DATE, Deadline) AS DaysOverdue
FROM Projects
WHERE Deadline < CURRENT_DATE;


-- Create a stored procedure to update project team members (remove existing, add new ones)
CREATE PROCEDURE UpdateProjectTeam(
    IN projectID INT,
    IN newTeamMembers TEXT
)
BEGIN
    DELETE FROM TeamMembers WHERE ProjectID = projectID;
    INSERT INTO TeamMembers (ProjectID, EmployeeID)
    SELECT projectID, EmployeeID FROM Employees
    WHERE FIND_IN_SET(EmployeeName, newTeamMembers);
END;


-- Create a trigger to prevent deleting a project that still has assigned team members
CREATE TRIGGER PreventProjectDeletion
BEFORE DELETE ON Projects
FOR EACH ROW
BEGIN
    DECLARE memberCount INT;
    SELECT COUNT(*) INTO memberCount
    FROM TeamMembers WHERE ProjectID = OLD.ProjectID;
    IF memberCount > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete project with assigned team members';
    END IF;
END;
